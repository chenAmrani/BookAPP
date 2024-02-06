import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user_model";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
  locals?: {
    currentUserId?: string;
  };
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user: IUser) => {
      if (err) {
        console.log("err", err);
        if (err.message === "jwt expired") {
          return res.status(401).json({ error: "Token is expired" });
        }
        //console.error('Token Verification Error:', err);
        return res.status(401).json({ error: "Token is not valid" });
      }
      req.user = user;
      req.locals = req.locals || {};
      req.locals.currentUserId = user._id;
      console.log("User", user);
      next();
    });
  } catch (err) {
    console.error("Unexpected Error:", err);
    res.status(500).send("Internal Server Error");
  }
};
export default authMiddleware;
