
import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";

interface CustomRequest extends Request {
  locals: {
    currentUserId?: string;
  };
}

const getAllUsers = async (req: CustomRequest , res: Response): Promise<void> =>{
  try {
    const users = await User.find();
    res.status(200).send({users});
  } catch (error) {
    res.status(500).send({ message: "Error fetching users" });
  }
};

const getUserById = async (req: CustomRequest , res: Response) : Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Internal Server Error -> getUserById");
  }
};




const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    const { name, email, password } = req.body.user;

    if (!name && !email && !password) {
      res
        .status(400)
        .send(
          "At least one field (name, email, or password) is required for update"
        );
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, encryptedPassword },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send("Internal Server Error -> updateUser");
  }
};

const deleteUser = async (req: Request, res: Response) : Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json({ message: "Usere deleted succesfully" });
  } catch (err) {
    res.status(500).send("Internal Server Error -> deleteUser");
  }
};

const updateOwnProfile = async (req: CustomRequest,res: Response): Promise<void> => {
  const { currentUserId } = req.locals;

  if (!currentUserId) {
    res.status(400).send("User ID is required for updating the profile");
    return;
  }

  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    res
      .status(400)
      .send(
        "At least one field (name, email, or password) is required for update"
      );
    return;
  }

  try {
    const updatedUserData: {
      name: string;
      email: string;
      password?: string;
    } = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedUserData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      updatedUserData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send("Internal Server Error -> updateOwnProfile");
  }
};

const getMyBooks = async (req: Request, res: Response) : Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const myBooks = user.books || [];
    res.status(200).json({myBooks});
  } catch (err) {
    res.status(500).send("Internal Server Error -> getMyBooks");
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateOwnProfile,
  getMyBooks,
};