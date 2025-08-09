const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  // const mininstry = await prisma.ministry.create({
  //   data: {
  //     name: "worship",
  //     description: "Turning to christ in worship",
  //     leaderId: "cmdyug60e0000rqhot5b47ii0",
  //   },
  // });
  // console.log(mininstry);

  const availableEvents = await prisma.event.deleteMany();
  console.log(availableEvents);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
