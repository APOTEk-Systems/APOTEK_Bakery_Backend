import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      permissions: decoded.permissions,
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
