import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const salesRaw = await prisma.sale.findMany({
        where: {
            status: "unpaid",
            isCredit: true,
            createdAt:{
                lt: new Date(new Date().setDate(new Date().getDate() - 30)),
                gt: new Date(new Date().setDate(new Date().getDate() - 60))
            }
        },
      include: {
        items: true,
        customer: true,
        soldBy: { select: { name: true } },
        creditPayments: true,
      },
      orderBy: { createdAt: "asc" },
      skip: (1 - 1) * 10,
      take: 10,
    });

    console.log("All users:", salesRaw);
    return allUsers;
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
