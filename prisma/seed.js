const { PrismaClient } = require("../src/generated/prisma");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Create a default user for testing
  const defaultUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: "hashedpassword", // In a real app, hash this
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      membersince: faker.date.past().toISOString(),
      birthdate: faker.date.past().toISOString(),
      photo: faker.image.avatar(),
      isActive: true,
    },
  });
  console.log(`Created default user with id: ${defaultUser.id}`);

  // Create Roles
  const roles = [
    "Admin",
    "Member",
    "Events Manager",
    "Senior Pastor",
    "Finance Administrator",
    "Volunteer Coordinator",
  ];
  const createdRoles = [];
  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    createdRoles.push(role);
    console.log(`Created role: ${role.name}`);
  }

  // Create Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "hashedpassword",
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        membersince: faker.date.past().toISOString(),
        birthdate: faker.date.past().toISOString(),
        photo: faker.image.avatar(),
        isActive: faker.datatype.boolean(),
        roles: {
          set: [
            faker.helpers.arrayElement([
              "ADMIN",
              "MEMBER",
              "GUEST",
              "PRAYER_MANAGER",
              "COUNSELOR",
              "VOLUNTEER",
              "EVENTS_MANAGER",
              "SENIOR_PASTOR",
              "FINANCE_ADMINISTRATOR",
              "VOLUNTEER_COORDINATOR",
            ]),
          ],
        },
      },
    });
    users.push(user);
    console.log(`Created user: ${user.name}`);
  }

  // Create Families
  const families = [];
  for (let i = 0; i < 3; i++) {
    // Get a random user to be the creator of the family
    const creator = users[faker.number.int({ min: 0, max: users.length - 1 })];

    // Get 2 unique users to be members (excluding the creator)
    const potentialMembers = users.filter((u) => u.id !== creator.id);
    const shuffledMembers = faker.helpers.shuffle(potentialMembers);
    const members = shuffledMembers.slice(0, 2);

    const family = await prisma.family.create({
      data: {
        name: faker.lorem.words(2) + " Family",
        createdBy: {
          connect: {
            id: creator.id,
          },
        },
        members: {
          connect: [{ id: members[0].id }, { id: members[1].id }],
        },
      },
    });
    families.push(family);
    console.log(`Created family: ${family.name}`);
  }
  // Create Ministries
  const ministries = [];
  // Ensure Worship Ministry exists
  const worshipMinistry = await prisma.ministry.upsert({
    where: { name: "Worship Ministry" },
    update: {},
    create: {
      name: "Worship Ministry",
      description: "Ministry responsible for leading worship services and managing worship teams.",
      leader: {
        connect: {
          id: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        },
      },
    },
  });
  ministries.push(worshipMinistry);
  console.log(`Created or found ministry: ${worshipMinistry.name}`);

  for (let i = 0; i < 4; i++) { // Create 4 additional random ministries
    const ministry = await prisma.ministry.create({
      data: {
        name: faker.lorem.words(2) + " Ministry",
        description: faker.lorem.paragraph(),
        leader: {
          connect: {
            id: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
          },
        },
      },
    });
    ministries.push(ministry);
    console.log(`Created ministry: ${ministry.name}`);
  }

  // Create Ministry Members
  for (const ministry of ministries) {
    // Shuffle users and pick a random number of unique users for each ministry
    const shuffledUsers = faker.helpers.shuffle(users);
    const numberOfMembers = faker.number.int({ min: 1, max: 3 });
    const membersToAssign = shuffledUsers.slice(0, numberOfMembers);

    for (const user of membersToAssign) {
      await prisma.ministryMember.create({
        data: {
          ministryId: ministry.id,
          userId: user.id,
        },
      });
    }
  }
  console.log("Created ministry members.");

  // Create Events
  const events = [];
  const eventTypes = [
    "SERVICE",
    "MEETING",
    "TRIP",
    "APPOINTMENT",
    "CLASS",
    "EVENT",
  ];
  for (let i = 0; i < 10; i++) {
    const event = await prisma.event.create({
      data: {
        title: faker.lorem.words(3) + " Event",
        type: eventTypes[
          faker.number.int({ min: 0, max: eventTypes.length - 1 })
        ],
        date: faker.date.future(),
        location: faker.location.streetAddress(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        ministry: {
          connect: {
            id: ministries[
              faker.number.int({ min: 0, max: ministries.length - 1 })
            ].id,
          },
        },
      },
    });
    events.push(event);
    console.log(`Created event: ${event.title}`);
  }

  // Create Feedback (Testimonials)
  for (let i = 0; i < 5; i++) {
    await prisma.feedback.create({
      data: {
        eventId:
          events[faker.number.int({ min: 0, max: events.length - 1 })].id,
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        sentiment: faker.helpers.arrayElement([
          "POSITIVE",
          "NEUTRAL",
          "NEGATIVE",
        ]),
        comment: faker.lorem.paragraph(),
        tags: ["testimonial", faker.lorem.word()],
      },
    });
  }
  console.log("Created feedback (testimonials).");

  // Create Assets
  const assets = [];
  const assetTypes = [
    "VIDEO",
    "AUDIO",
    "IMAGE",
    "DOCUMENT",
    "LOGO",
    "FONT",
    "TEMPLATE",
    "SERMON",
    "RESOURCE",
  ];
  for (let i = 0; i < 10; i++) {
    const asset = await prisma.asset.create({
      data: {
        title: faker.lorem.words(2) + " Asset",
        type: assetTypes[
          faker.number.int({ min: 0, max: assetTypes.length - 1 })
        ],
        url: faker.internet.url(),
        uploaderId:
          users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        tags: faker.lorem.words(3).split(" "),
      },
    });
    assets.push(asset);
    console.log(`Created asset: ${asset.title}`);
  }

  // Create Sermons (assuming videoAsset is linked)
  for (let i = 0; i < 5; i++) {
    const speaker = users[faker.number.int({ min: 0, max: users.length - 1 })];

    // Generate a unique ID for the sermon first
    const sermonId = faker.string.uuid(); // Or use cuid() if that's what Prisma generates

    // Create the Asset with the sermonId
    const videoAsset = await prisma.asset.create({
      data: {
        title: faker.lorem.words(2) + " Video Asset",
        type: "VIDEO", // Ensure it's a video asset
        url: faker.internet.url(),
        uploaderId:
          users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        tags: ["sermon-video"],
        sermonId: sermonId, // Link this asset to the sermon ID
      },
    });

    // Now create the Sermon, referencing the sermonId that was used in the Asset
    const sermon = await prisma.sermon.create({
      data: {
        id: sermonId, // Use the same ID as the sermonId in the asset
        title: faker.lorem.words(4) + " Sermon",
        date: faker.date.past(),
        speakerId: speaker.id,
      },
    });
    console.log(`Created sermon: ${sermon.title}`);
  }
  console.log("Created sermons.");

  // Create Funds
  const funds = [];
  for (let i = 0; i < 3; i++) {
    const fund = await prisma.fund.create({
      data: {
        name: faker.finance.accountName() + " Fund",
        description: faker.lorem.sentence(),
      },
    });
    funds.push(fund);
    console.log(`Created fund: ${fund.name}`);
  }

  // Create Transactions
  const transactionTypes = ["DONATION", "EXPENSE", "REVENUE"];
  const transactionMethods = [
    "MPESA",
    "STRIPE",
    "PAYPAL",
    "CASH",
    "CHECK",
    "IN_KIND",
  ];
  for (let i = 0; i < 15; i++) {
    await prisma.transaction.create({
      data: {
        type: transactionTypes[
          faker.number.int({ min: 0, max: transactionTypes.length - 1 })
        ],
        amount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
        method:
          transactionMethods[
            faker.number.int({ min: 0, max: transactionMethods.length - 1 })
          ],
        description: faker.lorem.sentence(),
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        fundId: funds[faker.number.int({ min: 0, max: funds.length - 1 })].id,
        anomaly: faker.datatype.boolean(),
      },
    });
  }
  console.log("Created transactions.");

  // Create Tickets
  const urgencies = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  for (let i = 0; i < 5; i++) {
    await prisma.ticket.create({
      data: {
        issue: faker.lorem.sentence(),
        priority:
          urgencies[faker.number.int({ min: 0, max: urgencies.length - 1 })],
        status: faker.helpers.arrayElement(["Open", "In-Progress", "Closed"]),
        creatorId:
          users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        assigneeId:
          users[faker.number.int({ min: 0, max: users.length - 1 })].id,
      },
    });
  }
  console.log("Created tickets.");

  // Create Partners
  const partnerTypes = ["CHURCH", "NGO", "GOVERNMENT", "BUSINESS"];
  for (let i = 0; i < 5; i++) {
    await prisma.partner.create({
      data: {
        name: faker.company.name(),
        type: partnerTypes[
          faker.number.int({ min: 0, max: partnerTypes.length - 1 })
        ],
        mouUrl: faker.internet.url(),
        contact: faker.internet.email(),
      },
    });
  }
  console.log("Created partners.");

  // Create Counseling Sessions
  for (let i = 0; i < 5; i++) {
    const counselor =
      users[faker.number.int({ min: 0, max: users.length - 1 })];
    const client = users[faker.number.int({ min: 0, max: users.length - 1 })];
    await prisma.counselingSession.create({
      data: {
        counselorId: counselor.id,
        clientId: client.id,
        date: faker.date.future(),
        status: faker.helpers.arrayElement([
          "Scheduled",
          "Completed",
          "Cancelled",
        ]),
        notes: faker.lorem.paragraph(),
        progress: faker.number.int({ min: 0, max: 100 }),
      },
    });
  }
  console.log("Created counseling sessions.");

  // Create Waivers
  const waivers = [];
  for (let i = 0; i < 3; i++) {
    const waiver = await prisma.waiver.create({
      data: {
        title: faker.lorem.words(3) + " Waiver",
        content: faker.lorem.paragraphs(2),
      },
    });
    waivers.push(waiver);
    console.log(`Created waiver: ${waiver.title}`);
  }

  // Create Waiver Signatures
  for (const waiver of waivers) {
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      await prisma.waiverSignature.create({
        data: {
          waiverId: waiver.id,
          userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        },
      });
    }
  }
  console.log("Created waiver signatures.");

  // Create Audit Logs
  for (let i = 0; i < 10; i++) {
    await prisma.auditLog.create({
      data: {
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        action: faker.lorem.words(2) + " action",
        details: faker.lorem.sentence(),
      },
    });
  }
  console.log("Created audit logs.");

  // Create Volunteer Shifts
  for (let i = 0; i < 5; i++) {
    await prisma.volunteerShift.create({
      data: {
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        eventId:
          events[faker.number.int({ min: 0, max: events.length - 1 })].id,
        time: faker.date.future().toISOString(),
        conflictCheck: faker.datatype.boolean(),
        replacementPool: faker.lorem.words(2).split(" "),
        checkedIn: faker.datatype.boolean(),
      },
    });
  }
  console.log("Created volunteer shifts.");

  // Create Bible Studies
  const bibleStudies = [];
  for (let i = 0; i < 3; i++) {
    const bibleStudy = await prisma.bibleStudy.create({
      data: {
        title: faker.lorem.words(3) + " Study",
        description: faker.lorem.paragraph(),
      },
    });
    bibleStudies.push(bibleStudy);
    console.log(`Created bible study: ${bibleStudy.title}`);
  }

  // Create Lessons
  const lessons = [];
  for (const bs of bibleStudies) {
    for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
      const lesson = await prisma.lesson.create({
        data: {
          title: faker.lorem.words(2) + " Lesson",
          content: faker.lorem.paragraphs(1),
          bibleStudyId: bs.id,
        },
      });
      lessons.push(lesson);
    }
  }
  console.log("Created lessons.");

  // Create Bible Study Progress
  for (const user of users) {
    for (
      let i = 0;
      i < faker.number.int({ min: 0, max: lessons.length - 1 });
      i++
    ) {
      await prisma.bibleStudyProgress.create({
        data: {
          userId: user.id,
          lessonId:
            lessons[faker.number.int({ min: 0, max: lessons.length - 1 })].id,
          completed: faker.datatype.boolean(),
          targetSessions: faker.number.int({ min: 1, max: 5 }),
        },
      });
    }
  }
  console.log("Created bible study progress.");

  // Create Prayer Requests
  for (let i = 0; i < 10; i++) {
    await prisma.prayerRequest.create({
      data: {
        request: faker.lorem.sentence(),
        isUrgent: faker.datatype.boolean(),
        isPublic: faker.datatype.boolean(),
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
      },
    });
  }
  console.log("Created prayer requests.");

  // Create Theme Of The Week
  for (let i = 0; i < 3; i++) {
    await prisma.themeOfTheWeek.create({
      data: {
        title: faker.lorem.words(3),
        verse: faker.lorem.sentence(),
        reference: faker.lorem.word(),
      },
    });
  }
  console.log("Created theme of the week.");

  // Create Parental Controls
  for (let i = 0; i < 5; i++) {
    await prisma.parentalControl.create({
      data: {
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        contentFilter: faker.datatype.boolean(),
        activityMonitoring: faker.datatype.boolean(),
        screenTimeLimit: faker.datatype.boolean(),
        screenTimeHours: faker.number.int({ min: 0, max: 5 }),
        messagingRestrictions: faker.datatype.boolean(),
      },
    });
  }
  console.log("Created parental controls.");

  // Create Messages
  for (let i = 0; i < 10; i++) {
    const sender = users[faker.number.int({ min: 0, max: users.length - 1 })];
    await prisma.message.create({
      data: {
        senderId: sender.id,
        content: faker.lorem.sentence(),
      },
    });
  }
  console.log("Created messages.");

  // Create Push Subscriptions
  for (let i = 0; i < 5; i++) {
    await prisma.pushSubscription.create({
      data: {
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
        endpoint: faker.internet.url(),
        p256dh: faker.string.alphanumeric(20),
        auth: faker.string.alphanumeric(20),
      },
    });
  }
  console.log("Created push subscriptions.");

  // Call the baptism seed function
  await seedBaptismData();

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const seedBaptismData = require('./baptism-seed');

