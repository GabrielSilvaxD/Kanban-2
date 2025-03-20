import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Define the shape of the decoded token
interface DecodedToken {
  userId: number;
  username: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      authUser?: DecodedToken;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  // Verify the token
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;
    req.authUser = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Token expired. Please log in again.' });
    } else if (error instanceof JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token.' });
    } else {
      console.error('Token verification error:', error);
      res.status(500).json({ message: 'Server error during token verification.' });
    }
  }
};