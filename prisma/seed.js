import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Define settings data
  const settingsData = {
    information: {
      email: "info@mybakery.com",
      phone: "+255 700 123 456",
      address: "123 Bakery Street, Dar es Salaam",
      website: "https://mybakery.com",
      bakeryName: "Sweet Delights Bakery",
      description: "We specialize in fresh bread, cakes, and pastries baked daily."
    },
    businessHours: {
      data: [
        { day: "Monday", open: "08:00", close: "20:00" },
        { day: "Tuesday", open: "08:00", close: "20:00" },
        { day: "Wednesday", open: "08:00", close: "20:00" },
        { day: "Thursday", open: "08:00", close: "20:00" },
        { day: "Friday", open: "08:00", close: "22:00" },
        { day: "Saturday", open: "09:00", close: "22:00" },
        { day: "Sunday", open: "09:00", close: "18:00" },
      ]
    },
    notifications: {
      dailySalesSummary: true,
      lowInventoryAlerts: true,
      newOrderNotifications: true,
      customerBirthdayReminders: false
    },
    vatAndTax: {
      taxRate: 18,
      acceptCash: true,
      acceptCards: true
    }
  };

  // Seed each top-level object into Settings
  for (const [key, value] of Object.entries(settingsData)) {
    await prisma.settings.upsert({
      where: { key },
      update: { data: value },
      create: {
        key,
        data: value
      }
    });
  }

  console.log("✅ Settings seeded successfully (keys: information, businessHours, notifications, vatAndTax)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
