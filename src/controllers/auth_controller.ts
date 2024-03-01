
import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

const googleSignin = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email != null) {
      let user = await User.findOne({ email: email });
      if (user == null) {
        user = await User.create({
          name: payload?.name,
          email: email,
          password: "Signed up with a Google account",
          image: payload?.picture,
          isGoogleSsoUser: true,
        });
      }
      const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET
      );

      await user.save();

      const userData = prepareUser(user);
      res.status(201).send({ accessToken, refreshToken, userData });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  const name = req.body.name;

  if (!email || !password || !role || !name) {
    return res.status(400).send("missing email or password or role or name");
  }

  
     // Name validation
     const nameRegex = /^[a-zA-Z0-9\s]+$/;
     if (!nameRegex.test(name)) {
          return res.status(400).json({ error: "Invalid name format" });
       }

     // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format." });
        }

     // Password validation
      if (password.length < 6) {
           return res.status(400).json({ error: "Password must be at least 6 characters long." });
       }


  try {
    const doesUserExists = await User.findOne({ email: email });
    if (doesUserExists != null) {
      return res.status(406).send("email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email: email,
      password: encryptedPassword,
      image: req.file ? req.file.filename : undefined,
      role: role,
      name: name,
    });
    const userData = prepareUser(newUser);

    return res.status(201).send(userData);
  } catch (err) {
    return res.status(400).send("Error: " + err.message);
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }

  try {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(401).send("email or password incorrect");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("email or password incorrect");
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );

    await user.save();

    const userData = prepareUser(user);
    return res.status(200).send({
      accessToken,
      refreshToken,
      userData,
    });
  } catch (err) {
    return res.status(400).send("error");
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err) => {
    if (err) return res.sendStatus(401);
    try {
      return res.sendStatus(200);
    } catch (err) {
      res.sendStatus(401).send(err.message);
    }
  });
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }
      try {
        const userDb = await User.findOne({ _id: user._id });

        const accessToken = await jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        await userDb.save();
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};

export default {
  register,
  login,
  logout,
  refresh,
  googleSignin,
};

function prepareUser(
  newUser: Document<unknown, NonNullable<unknown>, IUser> &
    IUser &
    Required<{ _id: string }>
) {
  const userData = newUser.toObject();

  delete userData.password;
  // delete userData.refreshTokens; //לבדוק האם למחוק את זה
  return userData;
}