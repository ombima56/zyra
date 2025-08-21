import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session"; // Import createSession
import CryptoJS from "crypto-js";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create a server-side session and set an HTTP-only cookie
    await createSession(user.id);

    // Decrypt the secret key
    const secretKey = CryptoJS.AES.decrypt(user.encryptedSecretKey, password).toString(CryptoJS.enc.Utf8);

    // Return public key and decrypted secret
    return NextResponse.json(
      {
        publicKey: user.publicKey,
        secretKey: secretKey,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}