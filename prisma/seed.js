// prisma/seedSupplies.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.inventoryItem.createMany({
    data: [
      {
        name: "Baking Trays",
        unit: "pcs",
        currentQuantity: 50,
        minLevel: 10,
        maxLevel: 100,
        cost: 15000, // Tsh per tray
        type: "supplies",
        createdById: 1,
      },
      {
        name: "Mixing Bowls",
        unit: "pcs",
        currentQuantity: 20,
        minLevel: 5,
        maxLevel: 50,
        cost: 8000, // Tsh per bowl
        type: "supplies",
        createdById: 1,
      },
      {
        name: "Oven Gloves",
        unit: "pair",
        currentQuantity: 15,
        minLevel: 5,
        maxLevel: 30,
        cost: 5000, // Tsh per pair
        type: "supplies",
        createdById: 1,
      },
      {
        name: "Packaging Boxes",
        unit: "pcs",
        currentQuantity: 500,
        minLevel: 100,
        maxLevel: 1000,
        cost: 200, // Tsh per box
        type: "supplies",
        createdById: 1,
      },
      {
        name: "Cake Boards",
        unit: "pcs",
        currentQuantity: 200,
        minLevel: 50,
        maxLevel: 500,
        cost: 700, // Tsh per board
        type: "supplies",
        createdById: 1,
      },
      {
        name: "Paper Bags",
        unit: "pcs",
        currentQuantity: 1000,
        minLevel: 200,
        maxLevel: 2000,
        cost: 100, // Tsh per bag
        type: "supplies",
        createdById: 1,
      },
      {
        name: "Napkins",
        unit: "pcs",
        currentQuantity: 2000,
        minLevel: 500,
        maxLevel: 5000,
        cost: 50, // Tsh per napkin
        type: "supplies",
        createdById: 1,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("🌱 Supplies seeded"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
