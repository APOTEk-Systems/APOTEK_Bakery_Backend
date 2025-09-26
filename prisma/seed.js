// prisma/seedSupplies.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
 await prisma.expense.deleteMany()
}

main()
  .then(() => console.log("🌱 Supplies seeded"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
