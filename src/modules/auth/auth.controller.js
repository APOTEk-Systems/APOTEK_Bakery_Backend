import * as authService from './auth.service.js';

/**
 * @namespace AuthController
 * @description Handles incoming HTTP requests for authentication.
 */

/**
 * Handles user registration.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AuthController
 */
export const register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles user login.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AuthController
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password, res);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const loginWithCode = async (req, res) => {
  try {
    const { email, loginCode } = req.body;
    const { user, token } = await authService.loginWithCode(email, loginCode, res);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Handles refresh token requests.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AuthController
 */
export const refreshToken = async (req, res) => {
  try {
    const { user, token } = await authService.refreshToken(req, res);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Handles password reset requests.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AuthController
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    await authService.resetPassword(email, newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles user logout.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AuthController
 */
export const logout = async (req, res) => {
  try {
    await authService.logoutUser(req, res);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = (req, res) => {
  res.json(req.user);
};

export const updateMe = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, currentPassword, newPassword } = req.body;
    const user = await authService.updateMe(id, name, currentPassword, newPassword);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
