const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function seedGeneralFund() {
  console.log("Seeding General Funds donation plan...");

  const generalFundPlan = await prisma.donationPlan.upsert({
    where: { id: "general" }, // Use a consistent ID
    update: {},
    create: {
      id: "general", // Ensure the ID matches what the frontend expects
      name: "General Church Fund",
      description: "Your contribution to the general fund helps us allocate resources where they are most needed across all ministries and operations.",
      type: "GENERAL", // This must match the DonationPlanType enum
      imageUrl: "/images/community-prayer.png", // A generic image for the general fund
      goalAmount: null, // General fund typically doesn't have a specific goal
    },
  });

  console.log(`Upserted General Church Fund with ID: ${generalFundPlan.id}`);
}

seedGeneralFund()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
