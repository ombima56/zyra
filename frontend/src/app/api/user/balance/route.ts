
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { publicKey, balance } = await req.json();

  if (!publicKey || balance === undefined) {
    return NextResponse.json(
      { message: "Missing publicKey or balance" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        publicKey,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: parseFloat(balance),
      },
    });

    return NextResponse.json(
      { message: "Balance updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Balance update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
