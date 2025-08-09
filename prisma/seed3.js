const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const roles = [
    "members",
    "guests",
    "worship leader",
    "Overall ministries coordinator for: men, women, youth, couples and Family, Children’s, Young Adults, Elders, Singles",
    "Outreach Director",
    "Discipleship Leader",
    "Events Manager",
    "Counseling Coordinator",
    "Tech & Media Manager",
    "Finance Administrator",
    "Volunteer Coordinator",
    "Small Groups Leader(SGL)",
    "Children/Youth Director",
    "Secretary (bookings, maintenance, etc)",
    "Communications officer",
    "senior pastor",
    "outreach pastor",
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: { name: role },
    });
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
