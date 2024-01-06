import { Request, Response, NextFunction } from 'express';


export interface AuthRequest extends Request {
  user?: { _id: string; role: string };
}

const authorMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { user } = req;
  if (!user || (user.role !== 'author'&& user.role !== 'admin')) {
    return res.sendStatus(403); // Forbidden if not author or admin
  }
  next();
};

export default authorMiddleware;