
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();

  if (!phone || !code) {
    return NextResponse.json(
      { message: "Missing phone or code" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        phone,
        whatsappVerificationCode: code,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        whatsappVerified: true,
        whatsappVerificationCode: null, // Clear the code
      },
    });

    return NextResponse.json(
      { message: "WhatsApp verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("WhatsApp verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
