import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const returns = await prisma.salesAdjustment.findMany({
      include:{
        items: true
      }
    });
   console.log(
  "Sales Adjustments:",
  JSON.stringify(
    returns.map(r => ({
      id: r.id,
      items: r.items.map(i => ({
        id: i.id,
        price: i.price,
        quantity: i.quantity
      }))
    })),
    null,
    2
  )
);

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
