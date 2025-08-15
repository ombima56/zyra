import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Keypair } from "@stellar/stellar-sdk";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, phone, password } = req.body;

  if (!email || !phone || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secret = keypair.secret();

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        publicKey,
        secret, // Storing secret directly for now
        whatsappVerificationCode: verificationCode,
      },
    });

    res.status(201).json({
      publicKey: user.publicKey,
      whatsappVerificationCode: verificationCode,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
