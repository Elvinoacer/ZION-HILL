import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { RoleName } from '@/generated/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  // RBAC check for sensitive types
  const isPrivileged = session.user.roles?.includes(RoleName.ADMIN) || session.user.roles?.includes(RoleName.VOLUNTEER_COORDINATOR);
  
  if (['volunteers', 'retention-metrics'].includes(type || '') && !isPrivileged) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    switch (type) {
      case 'roles':
        const roles = await prisma.role.findMany();
        return NextResponse.json(roles);
      case 'shifts':
        const shifts = await prisma.volunteerShift.findMany();
        return NextResponse.json(shifts);
      case 'volunteers':
        const volunteers = await prisma.user.findMany({
          where: { roles: { has: 'VOLUNTEER' } },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            roles: true
          }
        });
        return NextResponse.json(volunteers);
      case 'needs':
        // This is a placeholder. You'll need to define how to calculate these needs.
        return NextResponse.json([]);
      case 'retention-metrics':
        // This is a placeholder. You'll need to define how to calculate these metrics.
        return NextResponse.json([]);
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (!session.user.roles?.includes(RoleName.ADMIN) && !session.user.roles?.includes(RoleName.VOLUNTEER_COORDINATOR))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const body = await request.json();

  try {
    switch (type) {
      case 'onboard':
        // In a real app, you'd onboard the volunteer
        return NextResponse.json({ message: 'Onboarding initiated' });
      case 'schedule-shift':
        const newShift = await prisma.volunteerShift.create({ data: body });
        return NextResponse.json(newShift);
      case 'check-in':
        const checkedInShift = await prisma.volunteerShift.update({ where: { id: body.id }, data: { checkedIn: true } });
        return NextResponse.json(checkedInShift);
      case 'award-badge':
        // In a real app, you'd award a badge
        return NextResponse.json({ message: 'Badge awarded' });
      case 'analyze-feedback':
        // In a real app, you'd analyze feedback
        return NextResponse.json({ message: 'Feedback analyzed' });
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating data' }, { status: 500 });
  }
}
