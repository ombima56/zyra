import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { body } = req; // In a real WhatsApp webhook, the message will be in the body
  const message = body.message;
  const from = body.from; // The user's WhatsApp number

  if (!message || !from) {
    return res.status(400).json({ message: "Missing message or sender" });
  }

  try {
    // 1. Verification Logic
    const verificationCode = message.trim();
    if (/^\d{6}$/.test(verificationCode)) {
      const user = await prisma.user.findFirst({
        where: {
          whatsappVerificationCode: verificationCode,
          phone: from,
        },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            whatsappVerified: true,
            whatsappVerificationCode: null, // Clear the code after verification
          },
        });
        // In a real app, you would send a confirmation message back to the user
        return res.status(200).json({ message: "Account verified successfully" });
      }
    }

    // 2. Deposit Logic (Placeholder)
    if (message.toLowerCase().startsWith("deposit")) {
      // TODO: Implement M-Pesa deposit logic
      return res.status(200).json({ message: "Deposit functionality not yet implemented" });
    }

    // 3. Send Logic (Placeholder)
    if (message.toLowerCase().startsWith("send")) {
      // TODO: Implement send money logic
      return res.status(200).json({ message: "Send money functionality not yet implemented" });
    }

    // If no command is matched
    res.status(400).json({ message: "Invalid command" });

  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
