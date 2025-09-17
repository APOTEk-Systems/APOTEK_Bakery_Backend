import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const createdById = 1; // all products will be created by this user

  // --- Croissant ---
  await prisma.product.create({
    data: {
      name: "Croissant",
      price: 2.5,
      instructions: JSON.stringify([
        "Mix ingredients",
        "Knead dough",
        "Let it rise",
        "Bake at 180C",
      ]),
      createdById,
      updatedById: createdById,
      productRecipes: {
        create: [
          { inventoryItemId: 1, amountRequired: 0.2 }, // Flour
          { inventoryItemId: 2, amountRequired: 0.1 }, // Sugar
          { inventoryItemId: 4, amountRequired: 0.02 }, // Yeast
          { inventoryItemId: 3, amountRequired: 0.05 }, // Butter
          { inventoryItemId: 6, amountRequired: 0.15 }, // Milk
          { inventoryItemId: 5, amountRequired: 0.01 }, // Salt
        ],
      },
    },
  });

  // --- Bread ---
  await prisma.product.create({
    data: {
      name: "Bread",
      price: 1.2,
      instructions: JSON.stringify([
        "Mix flour, water, yeast, and salt",
        "Knead dough",
        "Let it rise",
        "Bake at 200C",
      ]),
      createdById,
      updatedById: createdById,
      productRecipes: {
        create: [
          { inventoryItemId: 1, amountRequired: 0.5 }, // Flour
          { inventoryItemId: 4, amountRequired: 0.02 }, // Yeast
          { inventoryItemId: 5, amountRequired: 0.01 }, // Salt
          { inventoryItemId: 6, amountRequired: 0.3 },  // Milk
        ],
      },
    },
  });

  // --- Cake ---
  await prisma.product.create({
    data: {
      name: "Cake",
      price: 3.0,
      instructions: JSON.stringify([
        "Mix flour, sugar, eggs, butter, and milk",
        "Pour batter into pan",
        "Bake at 180C",
      ]),
      createdById,
      updatedById: createdById,
      productRecipes: {
        create: [
          { inventoryItemId: 1, amountRequired: 0.3 }, // Flour
          { inventoryItemId: 2, amountRequired: 0.2 }, // Sugar
          { inventoryItemId: 7, amountRequired: 3 },   // Eggs
          { inventoryItemId: 3, amountRequired: 0.1 }, // Butter
        ],
      },
    },
  });

  // --- Donut ---
  await prisma.product.create({
    data: {
      name: "Donut",
      price: 1.5,
      instructions: JSON.stringify([
        "Mix flour, sugar, yeast, and milk",
        "Let dough rise",
        "Shape into donuts",
        "Fry until golden",
      ]),
      createdById,
      updatedById: createdById,
      productRecipes: {
        create: [
          { inventoryItemId: 1, amountRequired: 0.25 }, // Flour
          { inventoryItemId: 2, amountRequired: 0.1 },  // Sugar
          { inventoryItemId: 4, amountRequired: 0.01 }, // Yeast
          { inventoryItemId: 8, amountRequired: 0.05 }, // Oil
        ],
      },
    },
  });

  // --- Muffin ---
  await prisma.product.create({
    data: {
      name: "Muffin",
      price: 2.0,
      instructions: JSON.stringify([
        "Mix flour, sugar, eggs, butter, and milk",
        "Pour batter into muffin tins",
        "Bake at 180C",
      ]),
      createdById,
      updatedById: createdById,
      productRecipes: {
        create: [
          { inventoryItemId: 1, amountRequired: 0.2 }, // Flour
          { inventoryItemId: 2, amountRequired: 0.1 }, // Sugar
          { inventoryItemId: 7, amountRequired: 2 },   // Eggs
          { inventoryItemId: 6, amountRequired: 0.1 }, // Milk
          { inventoryItemId: 3, amountRequired: 0.05 }, // Butter
        ],
      },
    },
  });

  // --- Chocolate Cake ---
  await prisma.product.create({
    data: {
      name: "Chocolate Cake",
      price: 4.0,
      instructions:JSON.stringify([
        "Mix flour, sugar, cocoa powder",
        "Add eggs, butter, and milk",
        "Pour into pan",
        "Bake at 180C",
      ]),
      createdById:createdById,
      updatedById: createdById,
      productRecipes: {
        create: [
          { inventoryItemId: 1, amountRequired: 0.3 }, // Flour
          { inventoryItemId: 8, amountRequired: 0.2 }, // Chocolate
          { inventoryItemId: 2, amountRequired: 0.2 }, // Sugar
          { inventoryItemId: 7, amountRequired: 3 },   // Eggs
          { inventoryItemId: 3, amountRequired: 0.1 }, // Butter
        ],
      },
    },
  });

  // --- Pancake ---
  await prisma.product.create({
    data: {
      name: "Pancake",
      price: 1.8,
      instructions: JSON.stringify([
        "Mix flour, eggs, milk, and sugar",
        "Pour batter onto griddle",
        "Cook until golden on both sides",
      ]),
      createdById,
      updatedById: createdById,
      productRecipes: {
        create: [
          { inventoryItemId: 1, amountRequired: 0.2 }, // Flour
          { inventoryItemId: 7, amountRequired: 2 },   // Eggs
          { inventoryItemId: 6, amountRequired: 0.15 }, // Milk
          { inventoryItemId: 2, amountRequired: 0.05 }, // Sugar
          { inventoryItemId: 3, amountRequired: 0.05 }, // Butter
        ],
      },
    },
  });

  console.log("✅ Seeded bakery products with createdById = 1");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
