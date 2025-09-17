
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
