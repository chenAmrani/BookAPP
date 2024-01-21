import { Request, Response, NextFunction } from 'express';
import User from '../models/user_model';
import jwt from 'jsonwebtoken';
//check
interface CustomRequest extends Request {
    user?: { _id: string;};
  }

const verifyBookOwner = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
        return res.sendStatus(401).send("missing authorization header");
        }
      //author id
        const authorId = req.body.author;

        
        if (!authorId) {
            return res.status(400).send('author id required for verification');
        }

        const decoded = jwt.decode(token) as { _id: string } | null;
        const userId = decoded._id; //the id of the user that is logged in
    
        const user = await User.findOne({_id : userId}) //checl if this exist user.

        
        if (!user || user._id.toString() !== authorId) {
            return res.status(403).send('You do not have permission to modify this user');
        }

        next();
    } catch (err) {
        console.error('Error in verifyUserOwnership:', err);
        res.status(500).send('Internal Server Error -> verifyUserOwnership');
    }
}

export default verifyBookOwner;