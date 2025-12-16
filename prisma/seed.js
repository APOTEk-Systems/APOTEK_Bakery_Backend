import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
   await prisma.inventoryAdjustment.deleteMany()
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
