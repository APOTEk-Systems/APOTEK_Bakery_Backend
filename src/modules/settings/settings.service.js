import { PrismaClient as MultiPrismaClient } from '../../generated/prisma-client/index.js';
const prisma = new MultiPrismaClient();

/**
 * @namespace SettingsService
 * @description Handles all application settings-related business logic.
 */

/**
 * Retrieves all application settings for a specific bakery.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object>} A promise that resolves to an object containing all settings for the bakery.
 * @memberof SettingsService
 */
export const getAllSettings = async (bakeryId) => {
  const settings = await prisma.settings.findMany({ where: { bakeryId } });
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.data;
    return acc;
  }, {});
};

/**
 * Updates application settings for a specific key within a bakery.
 * @param {string} key - The key of the setting to update.
 * @param {object} updateData - An object containing the JSON data for the specified key.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object>} A promise that resolves to the updated settings data for the key.
 * @memberof SettingsService
 */
export const updateSettings = async (key, updateData, bakeryId) => {
  const existingSetting = await prisma.settings.findUnique({
    where: { key_bakeryId: { key: key, bakeryId: bakeryId } },
  });

  const newData = { ...(existingSetting?.data || {}), ...updateData };

  const updatedSetting = await prisma.settings.upsert({
    where: { key_bakeryId: { key: key, bakeryId: bakeryId } },
    update: { data: newData },
    create: { key: key, data: newData, bakeryId: bakeryId },
  });

  return updatedSetting.data;
};


export async function createAdjustmentReason(data, bakeryId) {
    return prisma.adjustmentReason.create({ data: { ...data, bakeryId } });
}

export async function getAdjustmentReasons(bakeryId) {
    return prisma.adjustmentReason.findMany({where: { bakeryId }, orderBy: { name: 'asc' }});
}

export async function getAdjustmentReasonById(id, bakeryId) {
    return prisma.adjustmentReason.findFirst({ where: { id, bakeryId } });
}

export async function updateAdjustmentReason(id, data, bakeryId) {
    const reason = await prisma.adjustmentReason.findFirst({ where: { id, bakeryId } });
    if (!reason) {
        throw new Error("Adjustment reason not found in this bakery");
    }
    return prisma.adjustmentReason.update({
        where: { id },
        data,
    });
}

export async function deleteAdjustmentReason(id, bakeryId) {
    const reason = await prisma.adjustmentReason.findFirst({ where: { id, bakeryId } });
    if (!reason) {
        throw new Error("Adjustment reason not found in this bakery");
    }
    return prisma.adjustmentReason.delete({ where: { id } });
}
