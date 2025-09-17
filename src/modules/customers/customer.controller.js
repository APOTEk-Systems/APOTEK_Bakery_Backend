
import * as customerService from './customer.service.js';

/**
 * @namespace CustomerController
 * @description Handles incoming HTTP requests for customers.
 */

/**
 * Responds with a list of all customers.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof CustomerController
 */
export const getCustomers = async (req, res) => {
  const customers = await customerService.getAllCustomers();
  res.json(customers);
};

/**
 * Handles the creation of a new customer.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof CustomerController
 */
export const createNewCustomer = async (req, res) => {
  const newCustomer = await customerService.createCustomer(req.body, req.userId);
  res.status(201).json(newCustomer);
};

/**
 * Responds with a single customer by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof CustomerController
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(parseInt(req.params.id));
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handles the update of an existing customer.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof CustomerController
 */
export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await customerService.updateCustomer(parseInt(req.params.id), req.body);
    if (updatedCustomer) {
      res.json(updatedCustomer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles the deletion of a customer.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof CustomerController
 */
export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await customerService.deleteCustomer(parseInt(req.params.id));
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
