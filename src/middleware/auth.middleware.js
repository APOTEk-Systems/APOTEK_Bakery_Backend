import jwt from 'jsonwebtoken';
import { PrismaClient as MultiPrismaClient } from '../generated/prisma-client/index.js';

const prisma = new MultiPrismaClient();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, bakeryId: true, role: { select: { name: true, permissions: true } } },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions,
      bakeryId: user.bakeryId,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (requiredPermissions) => (req, res, next) => {
  if (!req.user || !req.user.permissions) {
    return res.status(403).json({ message: 'No permissions found for user' });
  }

  // If user has 'all' permission, grant access
  if (req.user.permissions.includes('all')) {
    return next();
  }

  const hasPermission = requiredPermissions.some(permission => req.user.permissions.includes(permission));

  if (hasPermission) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
};

export default authMiddleware;
