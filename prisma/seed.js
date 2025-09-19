// prisma/seedProducts.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  
  console.log("Seeding Supplier");
  await prisma.supplier.create({
    data:{
      name:"Utilltis Supplier Pro",
      contactInfo:"+255 678 432 114",
      
    }
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
