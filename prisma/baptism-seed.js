const { PrismaClient } = require("../src/generated/prisma");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seedBaptismData() {
  console.log("Seeding baptism data...");

  const users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log("No users found. Please run the main seed file first.");
    return;
  }

  const baptismStatuses = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "SCHEDULED",
    "COMPLETED",
  ];

  for (let i = 0; i < 10; i++) {
    const user = faker.helpers.arrayElement(users);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        baptismApplicationStatus: faker.helpers.arrayElement(baptismStatuses),
        baptismClassCompleted: faker.datatype.boolean(),
        baptismDate: faker.datatype.boolean() ? faker.date.future() : null,
      },
    });
  }
  console.log("Baptism data seeded successfully.");
}

seedBaptismData()
  .catch((error) => {
    console.error("Error seeding baptism data:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
