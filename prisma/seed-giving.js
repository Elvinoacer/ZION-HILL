const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.giving.createMany({
    data: [
      {
        id: 'cky2qj3g50000u09m9g7h3k8n',
        name: 'Tithes',
        description: 'Regular tithes from church members.',
      },
      {
        id: 'cky2qj3g50001u09m4f7g3h9o',
        name: 'Project/Support',
        description: 'Support for various church projects and outreach programs.',
      },
      {
        id: 'cky2qj3g50002u09m9g7h3k8p',
        name: 'Special Offerings',
        description: 'Special offerings for specific events or causes.',
      },
    ],
    skipDuplicates: true, // This will prevent errors if the records already exist
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
