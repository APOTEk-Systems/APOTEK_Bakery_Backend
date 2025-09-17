import * as settingsService from './settings.service.js';

/**
 * @namespace SettingsController
 * @description Handles incoming HTTP requests for settings.
 */

/**
 * Responds with all application settings.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SettingsController
 */
export const getSettings = async (req, res) => {
  const settings = await settingsService.getAllSettings();
  res.json({ data: settings });
};

/**
 * Handles the update of application settings.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SettingsController
 */
export const updateSettings = async (req, res) => {
  const updatedSettings = await settingsService.updateSettings(req.body);
  res.json({ success: true, data: updatedSettings });
};
