import  { Request, Response, NextFunction } from "express";
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
    let  id  = '';
    if (req.params.id ){
      id = req.params.id ;
    }else if (req.body.id){
      id = req.body.id;
    }
    const currentUserId =  req.locals?.currentUserId;
    console.log("Middleware - ID: " + id);
    console.log("Middleware - currentUserId: " + currentUserId);
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
