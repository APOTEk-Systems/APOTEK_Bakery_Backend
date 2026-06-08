import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
const email = "[admin@bakery.com](mailto:admin@bakery.com)";

const existingUser = await prisma.user.findUnique({
where: { email }
});

if (existingUser) {
console.log("Admin already exists");
return;
}

const hashedPassword = await bcrypt.hash("Admin123!", 10);

const role = await prisma.userRole.upsert({
where: { name: "admin" },
update: {
permissions: ["all"]
},
create: {
name: "admin",
permissions: ["all"]
}
});

const admin = await prisma.user.create({
data: {
name: "Admin",
email,
password: hashedPassword,
phoneNumber: null,
role: {
connect: {
id: role.id
}
}
}
});

console.log("Admin created:", admin.email);
}

main()
.catch((e) => {
console.error(e);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});
