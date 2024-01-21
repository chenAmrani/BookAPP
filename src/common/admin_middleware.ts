import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user_model';
//check
export interface AuthRequest extends Request {
  user?: { _id: string};
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
  return res.sendStatus(401).send("missing authorization header");
  }
  
    const decoded = jwt.decode(token) as { _id: string } | null;
    const userId = decoded._id;
    
    const user = await User.findOne({_id : userId})
    if(user.role.match('admin'))
    {
      next();
    }
  

    else {
      return res.status(403).send("Not admin");
    }


 
};

export default authMiddleware;