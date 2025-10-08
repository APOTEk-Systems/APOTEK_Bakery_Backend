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
  const settings = await prisma.settings.findMany();
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.data;
    return acc;
  }, {});
};

/**
 * Updates application settings for a specific key.
 * @param {string} key - The key of the setting to update (e.g., "information", "notifications").
 * @param {object} updateData - An object containing the JSON data for the specified key.
 * @returns {Promise<object>} A promise that resolves to the updated settings data for the key.
 * @memberof SettingsService
 */
export const updateSettings = async (key, updateData) => {
  const existingSetting = await prisma.settings.findUnique({
    where: { key: key },
  });

  const newData = { ...(existingSetting?.data || {}), ...updateData };

  const updatedSetting = await prisma.settings.upsert({
    where: { key: key },
    update: { data: newData },
    create: { key: key, data: newData },
  });

  return updatedSetting.data;
};


export async function createAdjustmentReason(data) {
    return prisma.adjustmentReason.create({ data });
}

export async function getAdjustmentReasons() {
    return prisma.adjustmentReason.findMany({});

}

export async function getAdjustmentReasonById(id) {
    return prisma.adjustmentReason.findUnique({ where: { id } });
}

export async function updateAdjustmentReason(id, data) {
    return prisma.adjustmentReason.update({
        where: { id },
        data,
    });
}

export async function deleteAdjustmentReason(id) {
    return prisma.adjustmentReason.delete({ where: { id } });
}
