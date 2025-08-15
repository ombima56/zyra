import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Keypair } from "@stellar/stellar-sdk";
import bcrypt from "bcrypt";
import { formatPhoneNumber } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const { email, phone, password } = await req.json();

  if (!email || !phone || !password) {
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

    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secret = keypair.secret();

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
        secret, // Storing secret directly for now
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
