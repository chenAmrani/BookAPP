import { AuthRequest } from './auth_middleware';
import { Response, NextFunction } from 'express';

const verifyOwnership = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { user } = req;
  
  if (!user) {
    return res.sendStatus(401); 
  }


  if (user._id !== req.params.userId) {
    return res.sendStatus(403); // Forbidden - User does not own the content
  }

  next(); 
};

export default verifyOwnership;
