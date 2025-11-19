const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const deletedGivings = await prisma.giving.deleteMany({
    where: {
      id: { in: ["cky2qj3g50000u09m9g7h3k8n", "cky2qj3g50002u09m9g7h3k8p"] },
    },
  });
  console.log("Deleted givings:", deletedGivings);
  await prisma.giving.createMany({
    data: [
      {
        id: "clerk-tithes",
        name: "Tithes",
        description: "Regular tithes from church members.",
        imageUrl: "/images/tithes-offerings.png",
      },
      {
        id: "clerk-project-support",
        name: "Project/Support",
        description:
          "Support for various church projects and outreach programs.",
        imageUrl: "/images/project-support.png",
      },
      {
        id: "clerk-special-offerings",
        name: "Special Offerings",
        description: "Special offerings for specific events or causes.",
        imageUrl: "/images/sepecial-offerings.png",
      },
    ],
    skipDuplicates: true, // This will prevent errors if the records already exist
  });
  const plans = await prisma.giving.findMany();
  console.log("Giving plans seeded:", plans);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
