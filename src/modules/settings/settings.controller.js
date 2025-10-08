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
  const { key, ...updateData } = req.body; // Extract key from body, rest is updateData
  const updatedSettings = await settingsService.updateSettings(key, updateData);
  res.json({ success: true, data: updatedSettings });
};


export async function createAdjustmentReasonHandler(req, res) {
    try {
        const reason = await settingsService.createAdjustmentReason(req.body);
        res.status(201).json(reason);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getAdjustmentReasonsHandler(req, res) {
    try {
        const reasons = await settingsService.getAdjustmentReasons(req.query);
        res.json(reasons);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getAdjustmentReasonHandler(req, res) {
    try {
        const reason = await settingsService.getAdjustmentReasonById(Number(req.params.id));
        if (!reason) {
            return res.status(404).json({ error: 'Adjustment reason not found' });
        }
        res.json(reason);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function updateAdjustmentReasonHandler(req, res) {
    try {
        const reason = await settingsService.updateAdjustmentReason(Number(req.params.id), req.body);
        res.json(reason);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function deleteAdjustmentReasonHandler(req, res) {
    try {
        await settingsService.deleteAdjustmentReason(Number(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
