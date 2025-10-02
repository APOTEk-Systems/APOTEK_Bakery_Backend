import * as userService from './user.service.js';

/**
 * @namespace UserController
 * @description Handles incoming HTTP requests for users.
 */

/**
 * Responds with a list of all users.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

/**
 * Handles the creation of a new user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const createNewUser = async (req, res) => {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

/**
 * Responds with a single user by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Convert id to integer
  const user = await userService.getUserById(userId); // Pass integer id
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

/**
 * Handles updating a user by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Convert id to integer
  const updatedUser = await userService.updateUser(userId, req.body);
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(updatedUser);
};

/**
 * Handles deleting a user by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof UserController
 */
export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Convert id to integer
  const deleted = await userService.deleteUser(userId); // Pass integer id
  if (!deleted) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User deleted successfully' });
};

export const getRoles = async (req, res) => {
  const roles = await userService.getAllRoles();
  res.json(roles);
};

export const createNewRole = async (req, res) => {
  const newRole = await userService.createRole(req.body);
  res.status(201).json(newRole);
};

export const getRoleById = async (req, res) => {
  const roleId = parseInt(req.params.id, 10);
  const role = await userService.getRoleById(roleId);
  if (!role) {
    return res.status(404).json({ message: 'Role not found' });
  }
  res.json(role);
};

export const updateRole = async (req, res) => {
  const roleId = parseInt(req.params.id, 10);
  const updatedRole = await userService.updateRole(roleId, req.body);
  if (!updatedRole) {
    return res.status(404).json({ message: 'Role not found' });
  }
  res.json(updatedRole);
};

export const deleteRole = async (req, res) => {
  const roleId = parseInt(req.params.id, 10);
  const deleted = await userService.deleteRole(roleId);
  if (!deleted) {
    return res.status(404).json({ message: 'Role not found' });
  }
  res.json({ message: 'Role deleted successfully' });
};