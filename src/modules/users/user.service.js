
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

// Helper function to parse permissions
const parsePermissions = (user) => {
  if (user && user.permissions && typeof user.permissions === 'string') {
    try {
      user.permissions = JSON.parse(user.permissions);
    } catch (e) {
      console.error('Error parsing permissions:', e);
      user.permissions = []; // Default to empty array on error
    }
  }
  return user;
};

/**
 * @namespace UserService
 * @description Handles all user-related business logic.
 */

/**
 * Retrieves all users from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of users.
 * @memberof UserService
 */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users.map(parsePermissions); // Apply parsing to each user
};

/**
 * Creates a new user.
 * @param {object} userData - The data for the new user.
 * @param {string} userData.email - The email of the user.
 * @param {string} [userData.name] - The name of the user.
 * @returns {Promise<object>} A promise that resolves to the newly created user.
 * @memberof UserService
 */
export const createUser = async (userData) => {
  const { email, password, ...rest } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = { ...rest, email, password: hashedPassword };
  if (data.permissions) {
    data.permissions = JSON.stringify(data.permissions);
  }
  const newUser = await prisma.user.create({ data });
  return parsePermissions(newUser);
};

/**
 * Retrieves a single user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, or null otherwise.
 * @memberof UserService
 */
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return parsePermissions(user); // Apply parsing
};

/**
 * Updates an existing user.
 * @param {string} id - The ID of the user to update.
 * @param {object} userData - The updated data for the user.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 * @memberof UserService
 */
export const updateUser = async (id, userData) => {
  const data = { ...userData };
  if (data.permissions) {
    data.permissions = JSON.stringify(data.permissions);
  }
  const updatedUser = await prisma.user.update({ where: { id }, data });
  return parsePermissions(updatedUser); // Apply parsing
};

/**
 * Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted user object.
 * @memberof UserService
 */
export const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
};
