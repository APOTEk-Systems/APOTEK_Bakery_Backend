import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

/**
 * @namespace UserService
 * @description Handles all user-related business logic.
 */

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

/**
 * Retrieves all users from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of users.
 * @memberof UserService
 */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: { role: true },
  });
  return users;
};

/**
 * Creates a new user.
 * @param {object} userData - The data for the new user.
 * @param {string} userData.email - The email of the user.
 * @param {string} [userData.name] - The name of the user.
 * @param {number} userData.roleId - The ID of the role to assign to the user.
 * @returns {Promise<object>} A promise that resolves to the newly created user.
 * @memberof UserService
 */
export const createUser = async (userData) => {
  const { email, password, roleId, ...rest } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const loginCode = await generateUniqueLoginCode();

  const data = {
    ...rest,
    email,
    password: hashedPassword,
    loginCode,
    role: {
      connect: { id: roleId },
    },
  };

  const newUser = await prisma.user.create({
    data,
    include: { role: true },
  });
  return newUser;
};

/**
 * Retrieves a single user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, or null otherwise.
 * @memberof UserService
 */
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: { role: true },
  });
  return user;
};

/**
 * Updates an existing user.
 * @param {string} id - The ID of the user to update.
 * @param {object} userData - The updated data for the user.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 * @memberof UserService
 */
export const updateUser = async (id, userData) => {
  const { roleId, ...rest } = userData;
  const data = { ...rest };

  if (roleId) {
    data.role = {
      connect: { id: roleId },
    };
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
    include: { role: true },
  });
  return updatedUser;
};

/**
 * Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted user object.
 * @memberof UserService
 */
export const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id: parseInt(id) } });
};

/**
 * @namespace UserRoleService
 * @description Handles all user-role-related business logic.
 */

export const getAllRoles = async () => {
  return await prisma.userRole.findMany();
};

export const createRole = async (roleData) => {
  return await prisma.userRole.create({ data: roleData });
};

export const getRoleById = async (id) => {
  return await prisma.userRole.findUnique({ where: { id: parseInt(id) } });
};

export const updateRole = async (id, roleData) => {
  return await prisma.userRole.update({
    where: { id: parseInt(id) },
    data: roleData,
  });
};

export const deleteRole = async (id) => {
  return await prisma.userRole.delete({ where: { id: parseInt(id) } });
};