import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @namespace SettingsService
 * @description Handles all application settings-related business logic.
 */

/**
 * Retrieves all application settings.
 * @returns {Promise<object>} A promise that resolves to an object containing all settings.
 * @memberof SettingsService
 */
export const getAllSettings = async () => {
  // Settings are typically stored as key-value pairs. We'll fetch all and return as a single object.
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};

/**
 * Updates application settings.
 * @param {object} updateData - An object containing key-value pairs of settings to update.
 * @returns {Promise<object>} A promise that resolves to the updated settings.
 * @memberof SettingsService
 */
export const updateSettings = async (updateData) => {
  const updatedSettings = {};
  for (const key in updateData) {
    if (Object.hasOwnProperty.call(updateData, key)) {
      const value = updateData[key];
      await prisma.setting.upsert({
        where: { key: key },
        update: { value: String(value) }, // Store all values as strings
        create: { key: key, value: String(value) },
      });
      updatedSettings[key] = value;
    }
  }
  return updatedSettings;
};
