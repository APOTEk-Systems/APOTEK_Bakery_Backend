
import * as inventoryService from './inventory.service.js';

/**
 * @namespace InventoryController
 * @description Handles incoming HTTP requests for inventory.
 */

/**
 * Responds with a list of all inventory items.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof InventoryController
 */
export const getInventoryItems = async (req, res) => {
  const { type } = req.query;
  const inventoryItems = await inventoryService.getAllInventoryItems(type);
  res.json(inventoryItems);
};

/**
 * Handles the creation of a new inventory item.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof InventoryController
 */
export const createNewInventoryItem = async (req, res) => {
  const newInventoryItem = await inventoryService.createInventoryItem(req.body, req.userId);
  res.status(201).json(newInventoryItem);
};

/**
 * Responds with a single inventory item by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof InventoryController
 */
export const getInventoryItemById = async (req, res) => {
  try {
    const item = await inventoryService.getInventoryItemById(parseInt(req.params.id));
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handles the update of an existing inventory item.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof InventoryController
 */
export const updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await inventoryService.updateInventoryItem(parseInt(req.params.id), req.body, req.userId);
    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles the deletion of an inventory item.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof InventoryController
 */
export const deleteInventoryItem = async (req, res) => {
  try {
    const deleted = await inventoryService.deleteInventoryItem(parseInt(req.params.id));
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
