import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user_model';


export interface AuthRequest extends Request {
  user?: { _id: string; role: string };
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { _id: string };

    const user = await User.findById(decoded._id).select('_id role');

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = { _id: user._id, role: user.role }; // Set user object in the request
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

export default authMiddleware;