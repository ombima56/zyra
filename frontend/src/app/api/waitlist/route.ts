
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await prisma.waitlist.create({
      data: { email },
    });
    return NextResponse.json({ message: 'Successfully joined the waitlist' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join the waitlist' }, { status: 500 });
  }
}
