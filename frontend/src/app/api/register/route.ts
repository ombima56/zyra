import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { formatPhoneNumber } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const { email, phone, password, publicKey, encryptedSecretKey } = await req.json();

  if (!email || !phone || !password || !publicKey || !encryptedSecretKey) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const formattedPhone = formatPhoneNumber(phone);

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone: formattedPhone }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await prisma.user.create({
      data: {
        email,
        phone: formattedPhone,
        password: hashedPassword,
        publicKey,
        encryptedSecretKey,
        whatsappVerificationCode: verificationCode,
      },
    });

    return NextResponse.json(
      {
        publicKey: user.publicKey,
        whatsappVerificationCode: verificationCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
