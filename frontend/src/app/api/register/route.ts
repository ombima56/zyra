import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createKeypair } from "@/lib/stellar";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

const encrypt = (text: string, secret: string): string => {
  return CryptoJS.AES.encrypt(text, secret).toString();
};

export async function POST(request: Request) {
  try {
    const { email, phone, password } = await request.json();

    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { publicKey, secret } = createKeypair();

    const encryptedSecret = encrypt(secret, password);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        publicKey,
        secret: encryptedSecret,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", publicKey: user.publicKey },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
