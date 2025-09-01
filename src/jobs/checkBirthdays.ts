import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { birthdayEmailTemplate } from "@/templates/birthdayEmail";

async function checkBirthdays() {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const birthdayMembers = await prisma.$queryRaw<
      Array<{ email: string; name: string }>
    >`
      SELECT * FROM "User"
      WHERE EXTRACT(MONTH FROM birthday) = ${todayMonth}
      AND EXTRACT(DAY FROM birthday) = ${todayDay}
    `;

    for (const member of birthdayMembers) {
      await sendEmail({
        to: member.email,
        subject: "Happy Birthday!",
        html: birthdayEmailTemplate(member.name),
      });
    }

    // Revalidate the "Birthdays" page
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate-birthdays`, {
      method: "POST",
    });

    console.log("Checked for birthdays, sent emails, and revalidated page.");
  } catch (error) {
    console.error("Error checking for birthdays:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBirthdays();
