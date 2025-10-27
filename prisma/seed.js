import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
  const supplies = await prisma.expenseCategory.findFirst({
    where: { name: 'Utilities' }
  })

  console.log(supplies);



  const adj = await prisma.productAdj.create({
    data:{
      prodId:1.
      qty:10,
      des:"ofinaerofnds",
      date: new Date(),
      created:1,
      p
    },
  })
  

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
