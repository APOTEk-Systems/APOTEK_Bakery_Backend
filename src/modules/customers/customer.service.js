
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @namespace CustomerService
 * @description Handles all customer-related business logic.
 */

/**
 * Retrieves all customers from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of customers.
 * @memberof CustomerService
 */
export const getAllCustomers = async () => {
  return await prisma.customer.findMany();
};

/**
 * Creates a new customer.
 * @param {object} customerData - The data for the new customer.
 * @returns {Promise<object>} A promise that resolves to the newly created customer.
 * @memberof CustomerService
 */
export const createCustomer = async (customerData, userId) => {
  const data = {
    ...customerData,
    createdBy: { connect: { id: userId } },
    updatedBy: { connect: { id: userId } },
  };
  return await prisma.customer.create({ data });
};

/**
 * Retrieves a single customer by ID from the database.
 * @param {number} id - The ID of the customer to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the customer or null if not found.
 * @memberof CustomerService
 */
export const getCustomerById = async (id) => {
  return await prisma.customer.findUnique({
    where: { id }, include: { sales: true }
  });
};

/**
 * Updates an existing customer in the database.
 * @param {number} id - The ID of the customer to update.
 * @param {object} customerData - The data to update the customer with.
 * @returns {Promise<object>} A promise that resolves to the updated customer.
 * @memberof CustomerService
 */
export const updateCustomer = async (id, customerData) => {
  return await prisma.customer.update({
    where: { id },
    data: customerData,
  });
};

/**
 * Deletes a customer from the database.
 * @param {number} id - The ID of the customer to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted customer.
 * @memberof CustomerService
 */
export const deleteCustomer = async (id) => {
  return await prisma.customer.delete({
    where: { id },
  });
};
