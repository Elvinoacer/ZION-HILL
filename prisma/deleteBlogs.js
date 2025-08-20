const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  console.log("Deleting all blog posts (Assets with type 'DOCUMENT' and tag 'blog')...");
  try {
    const deleteBlogs = await prisma.asset.deleteMany({
      where: {
        type: 'DOCUMENT',
        tags: {
          has: 'blog',
        },
      },
    });
    console.log(`Deleted ${deleteBlogs.count} blog posts.`);
  } catch (e) {
    console.error("Error deleting blog posts:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();