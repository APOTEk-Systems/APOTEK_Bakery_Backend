import { PrismaClient as MultiPrismaClient } from '../../generated/prisma-client/index.js';
import bcrypt from 'bcryptjs';
const prisma = new MultiPrismaClient();

/**
 * @namespace UserService
 * @description Handles all user-related business logic.
 */

/**
 * Creates a new user within an existing bakery.
 * @param {object} userData - The data for the new user.
 * @param {number} bakeryId - The ID of the bakery to create the user in.
 * @returns {Promise<object>} A promise that resolves to the newly created user.
 * @memberof UserService
 */
export const createUser = async (userData, bakeryId) => {
  const { email, password, roleId, ...rest } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // ensure the role belongs to the same bakery
  const role = await prisma.userRole.findFirst({
      where: { id: roleId, bakeryId: bakeryId }
  });
  if (!role) {
      throw new Error("Role not found in this bakery");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const loginCode = await generateUniqueLoginCode();

  const data = {
    ...rest,
    email,
    password: hashedPassword,
    loginCode,
    bakeryId: bakeryId,
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
 * Retrieves a single user by their ID within a specific bakery.
 * @param {string} id - The ID of the user to retrieve.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object|null>} A promise that resolves to the user object if found, or null otherwise.
 * @memberof UserService
 */
export const getUserById = async (id, bakeryId) => {
  const user = await prisma.user.findFirst({
    where: { 
        id: parseInt(id),
        bakeryId: bakeryId,
    },
    include: { role: true },
  });
  return user;
};

/**
 * Updates an existing user within a specific bakery.
 * @param {string} id - The ID of the user to update.
 * @param {object} userData - The updated data for the user.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 * @memberof UserService
 */
export const updateUser = async (id, userData, bakeryId) => {
    const { roleId, ...rest } = userData;
    const data = { ...rest };
  
    if (roleId) {
      // Also ensure the role belongs to the same bakery
      const role = await prisma.userRole.findFirst({
          where: { id: roleId, bakeryId: bakeryId }
      });
      if (!role) {
          throw new Error("Role not found in this bakery");
      }
      data.role = {
        connect: { id: roleId },
      };
    }
  
    // Ensure user exists in the bakery before updating
    const existingUser = await prisma.user.findFirst({
        where: { id: parseInt(id), bakeryId: bakeryId }
    });
  
    if (!existingUser) {
        throw new Error("User not found in this bakery");
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) }, // id is unique, this is fine
      data,
      include: { role: true },
    });
    return updatedUser;
};

/**
 * Deletes a user by their ID within a specific bakery.
 * @param {string} id - The ID of the user to delete.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object>} A promise that resolves to the deleted user object.
 * @memberof UserService
 */
export const deleteUser = async (id, bakeryId) => {
    // Ensure user exists in the bakery before deleting
    const existingUser = await prisma.user.findFirst({
        where: { id: parseInt(id), bakeryId: bakeryId }
    });

    if (!existingUser) {
        throw new Error("User not found in this bakery");
    }
  return await prisma.user.delete({ where: { id: parseInt(id) } });
};

/**
 * @namespace UserRoleService
 * @description Handles all user-role-related business logic.
 */

export const getAllRoles = async (bakeryId) => {
  return await prisma.userRole.findMany({ where: { bakeryId }});
};

export const createRole = async (roleData, bakeryId) => {
    const data = { ...roleData, bakeryId };
    return await prisma.userRole.create({ data });
};

export const getRoleById = async (id, bakeryId) => {
  return await prisma.userRole.findFirst({ where: { id: parseInt(id), bakeryId } });
};

export const updateRole = async (id, roleData, bakeryId) => {
    // check role exists
    const existingRole = await prisma.userRole.findFirst({
        where: { id: parseInt(id), bakeryId: bakeryId }
    });
    if (!existingRole) {
        throw new Error("Role not found in this bakery");
    }
  return await prisma.userRole.update({
    where: { id: parseInt(id) },
    data: roleData,
  });
};

export const deleteRole = async (id, bakeryId) => {
    // check role exists
    const existingRole = await prisma.userRole.findFirst({
        where: { id: parseInt(id), bakeryId: bakeryId }
    });
    if (!existingRole) {
        throw new Error("Role not found in this bakery");
    }
  return await prisma.userRole.delete({ where: { id: parseInt(id) } });
};