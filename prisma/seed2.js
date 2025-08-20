const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");

async function main() {
  const users = await prisma.user.findMany();
  const ministries = [];
  for (let i = 0; i < 5; i++) {
    const ministry = await prisma.ministry.create({
      data: {
        name: faker.lorem.words(2) + " Ministry",
        description: faker.lorem.paragraph(),
        leader: {
          connect: {
            id: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
          },
        },
      },
    });
    ministries.push(ministry);
    console.log(`Created ministry: ${ministry.name}`);
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
