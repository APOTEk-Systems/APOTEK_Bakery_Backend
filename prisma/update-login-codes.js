import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function generateUniqueLoginCode() {
  let loginCode;
  let isUnique = false;

  while (!isUnique) {
    loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUser = await prisma.user.findUnique({
      where: { loginCode },
    });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return loginCode;
}

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.loginCode) {
      const loginCode = await generateUniqueLoginCode();
      await prisma.user.update({
        where: { id: user.id },
        data: { loginCode },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
