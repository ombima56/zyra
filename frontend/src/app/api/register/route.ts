// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Keypair } from "stellar-sdk";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, password } = body;

    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: "Email, phone, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate keypair
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secret = keypair.secret();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword, // 🔐 save hashed password
        publicKey,
        secret,
      },
    });

    return NextResponse.json(
      { message: "User created", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
