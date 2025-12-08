
import { PrismaClient as MultiPrismaClient } from '../../generated/prisma-client/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma = new MultiPrismaClient();

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

async function generateUniqueLoginCode() {
  let loginCode;
  let isUnique = false;

  while (!isUnique) {
    loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUser = await prisma.user.findUnique({
      where: { loginCode },
    });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return loginCode;
}

export const registerUser = async (userData) => {
    const { email, password, name, bakeryName } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const loginCode = await generateUniqueLoginCode();
    const hashedPassword = await bcrypt.hash(password, 10);
  
    return prisma.$transaction(async (tx) => {
        // 1. Create Bakery
        const newBakery = await tx.bakery.create({
            data: {
                name: bakeryName,
            }
        });

        // 2. Create settings entry
        await tx.settings.create({
            data: {
                key: 'information',
                data: { bakeryName: newBakery.name },
                bakeryId: newBakery.id,
            }
        });
    
        // 3. Create a default Admin role for the new bakery
        const adminRole = await tx.userRole.create({
            data: {
                name: 'Admin',
                permissions: ['all'], // Give all permissions to admin
                bakeryId: newBakery.id,
            }
        });
    
        // 4. Create the user
        const newUser = await tx.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                loginCode,
                bakeryId: newBakery.id,
                roleId: adminRole.id,
            },
            include: { role: true },
        });

        return newUser;
    });
};

export const loginUser = async (email, password, res) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id, bakeryId: user.bakeryId, role: user.role.name, permissions: user.role.permissions }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const refreshToken = crypto.randomBytes(32).toString('hex');
  const hashedRefreshToken = hashToken(refreshToken);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      expiresAt: refreshTokenExpiry,
      userId: user.id,
      bakeryId: user.bakeryId,
    },
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: refreshTokenExpiry,
  });

  return { user: { id: user.id, email: user.email, name:user.name, role: user.role.name, permissions: user.role.permissions, bakeryId: user.bakeryId }, token };
};

export const loginWithCode = async (email, loginCode, res) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    throw new Error('Account is locked. Please try again later.');
  }

  if (user.loginCode !== loginCode) {
    const failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    let lockoutUntil = null;

    if (failedLoginAttempts >= 10) {
      lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts,
        lockoutUntil,
      },
    });

    throw new Error('Invalid credentials');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockoutUntil: null,
    },
  });

  const token = jwt.sign({ userId: user.id, bakeryId: user.bakeryId, role: user.role.name, permissions: user.role.permissions }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const refreshToken = crypto.randomBytes(32).toString('hex');
  const hashedRefreshToken = hashToken(refreshToken);
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      expiresAt: refreshTokenExpiry,
      userId: user.id,
      bakeryId: user.bakeryId,
    },
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: refreshTokenExpiry,
  });

  return { user: { id: user.id, email: user.email, name:user.name, role: user.role.name, permissions: user.role.permissions, bakeryId: user.bakeryId }, token };
};

export const refreshToken = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.cookies;
  if (!oldRefreshToken) throw new Error('Refresh token not found');

  const hashedOldRefreshToken = hashToken(oldRefreshToken);
  const now = new Date();

  const tokenRecord = await prisma.refreshToken.findUnique({
    where: {
      token: hashedOldRefreshToken,
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!tokenRecord || tokenRecord.expiresAt < now) {
    throw new Error('Invalid or expired refresh token');
  }

  const { user } = tokenRecord;

  const newToken = jwt.sign({ userId: user.id, name:user.name, bakeryId: user.bakeryId, role: user.role.name, permissions: user.role.permissions }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const newRefreshToken = crypto.randomBytes(32).toString('hex');
  const hashedNewRefreshToken = hashToken(newRefreshToken);
  const newRefreshTokenExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: {
        id: tokenRecord.id,
      },
    }),
    prisma.refreshToken.create({
      data: {
        token: hashedNewRefreshToken,
        expiresAt: newRefreshTokenExpiry,
        userId: user.id,
        bakeryId: user.bakeryId,
      },
    }),
  ]);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: newRefreshTokenExpiry,
  });

  return { user: { id: user.id, email: user.email, name:user.name, role: user.role.name, permissions: user.role.permissions, bakeryId: user.bakeryId }, token: newToken };
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return;
  }

  const hashedRefreshToken = hashToken(refreshToken);

  await prisma.refreshToken.deleteMany({
    where: {
      token: hashedRefreshToken,
    },
  });

  res.clearCookie('refreshToken');
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

export const updateMe = async (userId, name, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const data = {};
  if (name) {
    data.name = name;
  }

  if (newPassword) {
    if (!currentPassword) {
      throw new Error('Current password is required to change password');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('Incorrect current password');
    data.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, role: true },
  });

  return updatedUser;
};

