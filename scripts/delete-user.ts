/**
 * Script to delete a user and all related records.
 * Run with: npx tsx scripts/delete-user.ts
 */
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const EMAIL_TO_DELETE = 'hwhyadlvsczuqzgqny@nespf.com';

async function main() {
  console.log(`Looking up user with email: ${EMAIL_TO_DELETE}`);
  
  const user = await prisma.user.findUnique({
    where: { email: EMAIL_TO_DELETE },
  });

  if (!user) {
    console.log('User not found. Nothing to delete.');
    return;
  }

  console.log(`Found user: ${user.id} (${user.name})`);

  // Delete related records in order of dependency
  // Start with records that depend on User

  console.log('Deleting related Messages...');
  await prisma.message.deleteMany({
    where: { OR: [{ senderId: user.id }, { recipientId: user.id }] },
  });

  console.log('Deleting related Family records (created by user)...');
  await prisma.family.deleteMany({
    where: { createdById: user.id },
  });

  console.log('Deleting related ministry memberships...');
  await prisma.ministryMember.deleteMany({
    where: { userId: user.id },
  });

  console.log('Deleting related transactions...');
  await prisma.transaction.deleteMany({
    where: { userId: user.id },
  });

  console.log('Deleting related participants...');
  await prisma.participant.deleteMany({
    where: { userId: user.id },
  });
  
  console.log('Deleting related FCM tokens...');
  await prisma.fcmToken.deleteMany({
    where: { userId: user.id },
  });

  console.log('Deleting related sessions...');
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  console.log('Deleting related accounts...');
  await prisma.account.deleteMany({
    where: { userId: user.id },
  });

  // Now delete the user
  console.log('Deleting user...');
  await prisma.user.delete({
    where: { id: user.id },
  });

  console.log(`Successfully deleted user: ${EMAIL_TO_DELETE}`);
}

main()
  .catch((e) => {
    console.error('Error deleting user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
