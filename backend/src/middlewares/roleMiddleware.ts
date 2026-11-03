import { Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { AuthRequest } from './authMiddleware';

/**
 * Authorization middleware to check if user has one of the required roles
 * This middleware should be used AFTER authMiddleware
 *
 * Special Viewer Rule:
 * Users with the 'viewer' role have universal READ-ONLY access to all dashboards/data (GET requests).
 * Any mutation request (POST, PUT, PATCH, DELETE) made by a viewer is rejected with 403 Forbidden.
 *
 * @param allowedRoles - Array of UserRole enums that can access the route
 * @returns Middleware function
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized: No user found' });
        return;
      }

      // Check if user has the 'viewer' role
      const isViewer = req.user.roles.includes('viewer');
      if (isViewer) {
        // Safe read-only HTTP methods are permitted
        if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
          return next();
        }
        res.status(403).json({
          success: false,
          message: 'Forbidden: Viewer has read-only access and cannot create, edit, or delete data.',
        });
        return;
      }

      // Check if user has at least one of the required roles
      const hasRequiredRole = req.user.roles.some((role: UserRole) =>
        allowedRoles.includes(role)
      );

      if (!hasRequiredRole) {
        res.status(403).json({
          success: false,
          message: `Forbidden: Access requires one of these roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error', error });
    }
  };
};
