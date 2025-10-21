//@ts-check
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function to parse instructions
const parseInstructions = (product) => {
  if (product && product.instructions && typeof product.instructions === 'string') {
    try {
      product.instructions = JSON.parse(product.instructions);
    } catch (e) {
      console.error('Error parsing instructions:', e);
      product.instructions = []; // Default to empty array on error
    }
  }
  return product;
};

/**
 * @namespace ProductService
 * @description Handles all product-related business logic.
 */

/**
 * Retrieves all products from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 * @memberof ProductService
 */
export const getAllProducts = async (page, limit, filter, orderBy) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filter) {
        where.OR = [
            { name: { contains: filter, mode: 'insensitive' } },
            { description: { contains: filter, mode: 'insensitive' } },
        ];
    }

    const products = await prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy,
        include: {
            productionRuns: {
                select: {
                    cost: true,
                    quantityProduced: true,
                },
            },
            productRecipes: {
                include: {
                    inventoryItem: true,
                },
            },
        },
    });

    const productsWithCost = products.map(product => {
        let totalCostPerSingleUnit = 0;
        let productionRunCount = 0;

        product.productionRuns.forEach(run => {
            if (run.quantityProduced > 0) {
                totalCostPerSingleUnit += (run.cost / run.quantityProduced);
                productionRunCount++;
            }
        });

        const averageProductionCost = productionRunCount > 0
            ? totalCostPerSingleUnit / productionRunCount
            : 0;

        // Remove productionRuns from the final output if not needed directly
        const { productionRuns, ...productWithoutRuns } = product;

        return {
            ...productWithoutRuns,
            averageProductionCost,
            profit: product.price - averageProductionCost,
        };
    });

    const total = await prisma.product.count({ where });

    return productsWithCost.map(parseInstructions);
};

/**
 * Creates a new product.
 * @param {object} productData - The data for the new product.
 * @param {string} productData.name - The name of the product.
 * @param {string} [productData.description] - An optional description.
 * @param {number} productData.price - The price of the product.
 * @returns {Promise<object>} A promise that resolves to the newly created product.
 * @memberof ProductService
 */
export const createProduct = async (productData, userId) => {
  const { productRecipes, ...rest } = productData;
  const data = {
    ...rest,
    instructions: JSON.stringify(rest.instructions || []),
    createdBy: { connect: { id: userId } },
    updatedBy: { connect: { id: userId } },
  };

  if (productRecipes && Array.isArray(productRecipes)) {
    data.productRecipes = {
      create: productRecipes.map(recipe => ({
        amountRequired: recipe.amountRequired,
        inventoryItemId: recipe.inventoryItemId
      }))
    };
  }

  const newProduct = await prisma.product.create({
    data,
    include: {
      productRecipes: {
        include: {
          inventoryItem: true
        }
      }
    }
  });
  return parseInstructions(newProduct);
};

/**
 * Retrieves a single product by its ID.
 * @param {string} id - The ID of the product to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the product object if found, or null otherwise.
 * @memberof ProductService
 */
export const getProductById = async (id) => {
    let product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
            productionRuns: {
                select: {
                    cost: true,
                    quantityProduced: true,
                },
            },
            productRecipes: {
                include: {
                    inventoryItem: true,
                },
            },
        },
    });

    if (product) {
        let totalCostPerSingleUnit = 0;
        let productionRunCount = 0;

        product.productionRuns.forEach(run => {
            if (run.quantityProduced > 0) {
                totalCostPerSingleUnit += (run.cost / run.quantityProduced);
                productionRunCount++;
            }
        });

        const averageProductionCost = productionRunCount > 0
            ? totalCostPerSingleUnit / productionRunCount
            : 0;

        // Remove productionRuns from the final output if not needed directly
        const { productionRuns, ...productWithoutRuns } = product;

        product = {
            ...productWithoutRuns,
            averageProductionCost,
        };
    }
  return parseInstructions(product);
};

/**
 * Updates an existing product.
 * @param {string} id - The ID of the product to update.
 * @param {object} productData - The updated data for the product.
 * @returns {Promise<object>} A promise that resolves to the updated product object.
 * @memberof ProductService
 */
export const updateProduct = async (id, productData, userId) => {
  const { productRecipes, ...rest } = productData;
  const data = {
    ...rest,
    instructions: JSON.stringify(rest.instructions || []),
    updatedBy: { connect: { id: userId } },
  };

  // Delete old productRecipes
  await prisma.productRecipe.deleteMany({
    where: { productId: parseInt(id) }
  });

  if (productRecipes && Array.isArray(productRecipes)) {
    data.productRecipes = {
      create: productRecipes.map(recipe => ({
        amountRequired: recipe.amountRequired,
        inventoryItemId: recipe.inventoryItemId
      }))
    };
  }

  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data,
    include: {
      productRecipes: {
        include: {
          inventoryItem: true
        }
      }
    }
  });
  return parseInstructions(updatedProduct);
};

/**
 * Deletes a product by its ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted product object.
 * @memberof ProductService
 */
export const deleteProduct = async (id) => {
  return await prisma.product.delete({ where: { id: parseInt(id) } });
};