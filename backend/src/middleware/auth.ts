import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../auth/jwt.js';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ error: 'Unauthorized. Authentication token required.' });
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
}
