
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma = new PrismaClient();

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const registerUser = async (userData) => {
  const { email, password, name, roleName, permissions, ...rest } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = await prisma.userRole.upsert({
    where: { name: roleName },
    update: { permissions },
    create: { name: roleName, permissions },
  });

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: {
        connect: { id: role.id },
      },
      ...rest,
    },
    select: { id: true, email: true },
  });
  return newUser;
};

export const loginUser = async (email, password, res) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id, role: user.role.name, permissions: user.role.permissions }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const refreshToken = crypto.randomBytes(32).toString('hex');
  const hashedRefreshToken = hashToken(refreshToken);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt: refreshTokenExpiry,
    },
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: refreshTokenExpiry,
  });

  return { user: { id: user.id, email: user.email, name:user.name, role: user.role.name, permissions: user.role.permissions }, token };
};

export const refreshToken = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.cookies;
  if (!oldRefreshToken) throw new Error('Refresh token not found');

  const hashedOldRefreshToken = hashToken(oldRefreshToken);
  const now = new Date();

  const user = await prisma.user.findFirst({
    where: {
      refreshToken: hashedOldRefreshToken,
      refreshTokenExpiresAt: { gt: now },
    },
    include: { role: true },
  });

  if (!user) throw new Error('Invalid or expired refresh token');

  const newToken = jwt.sign({ userId: user.id, name:user.name, role: user.role.name, permissions: user.role.permissions }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const newRefreshToken = crypto.randomBytes(32).toString('hex');
  const hashedNewRefreshToken = hashToken(newRefreshToken);
  const newRefreshTokenExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedNewRefreshToken,
      refreshTokenExpiresAt: newRefreshTokenExpiry,
    },
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: newRefreshTokenExpiry,
  });

  return { user: { id: user.id, email: user.email, name:user.name, role: user.role.name, permissions: user.role.permissions }, token: newToken };
};

export const resetPassword = async (email, newPassword) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Incorrect current password');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};
