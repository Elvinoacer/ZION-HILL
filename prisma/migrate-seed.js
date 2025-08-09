const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const families = await prisma.family.findMany();
  console.log("Available-families");
  console.log(families);

  console.log("Deleting families...");
  const deletedFams = await prisma.family.deleteMany();
  console.log("Finished", deletedFams);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
