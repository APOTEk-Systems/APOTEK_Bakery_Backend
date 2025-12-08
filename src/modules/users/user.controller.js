import * as userService from './user.service.js';

/**
 * @namespace UserController
 * @description Handles incoming HTTP requests for users.
 */

/**
 * Responds with a list of all users for the current bakery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const getUsers = async (req, res) => {
  const { bakeryId } = req.user;
  const users = await userService.getAllUsers(bakeryId);
  res.json(users);
};

/**
 * Handles the creation of a new user within the current user's bakery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const createNewUser = async (req, res) => {
  const { bakeryId } = req.user;
  try {
    const newUser = await userService.createUser(req.body, bakeryId);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Responds with a single user by ID from the current bakery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const getUserById = async (req, res) => {
  const { bakeryId } = req.user;
  const userId = parseInt(req.params.id, 10);
  const user = await userService.getUserById(userId, bakeryId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

/**
 * Handles updating a user by ID in the current bakery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const updateUser = async (req, res) => {
  const { bakeryId } = req.user;
  const userId = parseInt(req.params.id, 10);
  try {
    const updatedUser = await userService.updateUser(userId, req.body, bakeryId);
    res.json(updatedUser);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

/**
 * Handles deleting a user by ID from the current bakery.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const deleteUser = async (req, res) => {
  const { bakeryId } = req.user;
  const userId = parseInt(req.params.id, 10);
  try {
    await userService.deleteUser(userId, bakeryId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

/**
 * @namespace UserRoleController
 * @description Handles incoming HTTP requests for user roles.
 */

export const getRoles = async (req, res) => {
  const { bakeryId } = req.user;
  const roles = await userService.getAllRoles(bakeryId);
  res.json(roles);
};

export const createNewRole = async (req, res) => {
  const { bakeryId } = req.user;
  try {
    const newRole = await userService.createRole(req.body, bakeryId);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRoleById = async (req, res) => {
  const { bakeryId } = req.user;
  const roleId = parseInt(req.params.id, 10);
  const role = await userService.getRoleById(roleId, bakeryId);
  if (!role) {
    return res.status(404).json({ message: 'Role not found' });
  }
  res.json(role);
};

export const updateRole = async (req, res) => {
  const { bakeryId } = req.user;
  const roleId = parseInt(req.params.id, 10);
  try {
    const updatedRole = await userService.updateRole(roleId, req.body, bakeryId);
    res.json(updatedRole);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  const { bakeryId } = req.user;
  const roleId = parseInt(req.params.id, 10);
  try {
    await userService.deleteRole(roleId, bakeryId);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};