import { Request, Response, NextFunction } from 'express';
import User from '../models/user_model';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: { _id: string;};
    locals: {
      currentUserId?: string;
    };
  }

const verifyUserOwnership = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
        return res.sendStatus(401).send("missing authorization header");
        }
      
        console.log('req.body:', req.body);
        const { id } = req.body;
        const currentUserId = req.locals?.currentUserId;
        console.log('id:', id);
        
        if (!id || !currentUserId) {
            return res.status(400).send('User ID and current user ID are required for verification');
        }

        const decoded = jwt.decode(token) as { _id: string } | null;
        const userId = decoded._id;
    
        const user = await User.findOne({_id : userId})

        

    
        if (!user || user._id.toString() !== currentUserId) {
            return res.status(403).send('You do not have permission to modify this user');
        }

        next();
    } catch (err) {
        console.error('Error in verifyUserOwnership:', err);
        res.status(500).send('Internal Server Error -> verifyUserOwnership');
    }
}

export default verifyUserOwnership;