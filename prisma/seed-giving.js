const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.donationPlan.createMany({
    data: [
      {
        id: 'clerk-tithes',
        name: 'Tithes',
        description: 'Regular tithes from church members.',
        imageUrl: '/images/tithes-offerings.png',
        type: 'GENERAL'
      },
      {
        id: 'clerk-project-support',
        name: 'Project/Support',
        description: 'Support for various church projects and outreach programs.',
        imageUrl: '/images/project-support.png',
        type: 'PROJECT'
      },
      {
        id: 'clerk-special-offerings',
        name: 'Special Offerings',
        description: 'Special offerings for specific events or causes.',
        imageUrl: '/images/sepecial-offerings.png',
        type: 'GENERAL'
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
