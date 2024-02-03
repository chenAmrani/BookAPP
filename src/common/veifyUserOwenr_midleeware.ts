import { Request, Response, NextFunction } from "express";
import User from "../models/user_model";

interface CustomRequest extends Request {
  locals: {
    currentUserId?: string;
  };
}

const verifyUserOwner = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const currentUserId = req.locals?.currentUserId;
    console.log("this is the id test 2: " + id);
    console.log("this is the currentUserId test 2: " + currentUserId);
    if (!id || !currentUserId) {
      console.log("you have a problem here");
      return res
        .status(400)
        .send("User ID and current user ID are required for verification");
    }

    const user = await User.findById(id);
    // console.log("this is the user: " + user);

    if (!user || user._id.toString() !== currentUserId) {
      return res
        .status(403)
        .send("You do not have permission to modify this user");
    }

    next();
  } catch (err) {
    console.error("Error in verifyUserOwnership:", err);
    res.status(500).send("Internal Server Error -> verifyUserOwnership");
  }
};

export default verifyUserOwner;
