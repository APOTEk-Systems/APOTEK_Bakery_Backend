import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
  const allProducts = await prisma.product.findMany()
  console.log(allProducts)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
