import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '../types';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    name: string;
    email: string;
    roles: UserRole[];
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      roles: decoded.roles as UserRole[],
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

// Aliases for better readability in routes
export const protect = authMiddleware;

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Viewer read-only rule
    if (req.user.roles.includes('viewer')) {
      if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Viewer has read-only access and cannot modify data.',
      });
    }

    const upperRoles = roles.map(r => r.toUpperCase());
    const hasRole = req.user.roles.some((role) => upperRoles.includes(role.toUpperCase()));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to perform this action',
      });
    }

    next();
  };
};
