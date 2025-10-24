import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
  const allProducts = await prisma.sale.findMany({
    where:{
      paymentStatus: 'UNPAID',
      isCredit: true
    }
  })
  console.log(allProducts)


   const paj = await prisma.productAdj.findMany({
  
   })
   console.log(paj)
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
