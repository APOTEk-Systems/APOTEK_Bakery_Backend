import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const allUsers = await prisma.expenseCategory.findMany({orderBy: { name:{
    sort: 'asc',
    mode: 'insensitive', // 👈 supported for string fields
        } } });
        console.log('All users:', allUsers);
        return allUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });