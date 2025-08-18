import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { transfer } from "@/lib/stellar";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipient, amount } = await request.json();

    // Validate inputs
    if (!recipient || !amount) {
      return NextResponse.json(
        { error: "Recipient and amount are required" },
        { status: 400 }
      );
    }

    // Convert amount to the smallest unit (assuming 7 decimals like USDC)
    const amountInSmallestUnit = Math.floor(parseFloat(amount) * 10000000);

    if (amountInSmallestUnit <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate Stellar address format
    if (!recipient.startsWith("G") || recipient.length !== 56) {
      return NextResponse.json(
        { error: "Invalid recipient address format" },
        { status: 400 }
      );
    }

    // Prevent self-transfer
    if (recipient === session.user.publicKey) {
      return NextResponse.json(
        { error: "Cannot transfer to your own wallet" },
        { status: 400 }
      );
    }

    // Get user's secret key from database
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { secret: true, publicKey: true },
    });

    if (!user || !user.secret) {
      return NextResponse.json(
        { error: "User wallet not found" },
        { status: 404 }
      );
    }

    // Perform the transfer using the smart contract
    await transfer(
      user.publicKey,
      recipient,
      amountInSmallestUnit.toString(),
      user.secret
    );

    // Record the transaction in the database
    await prisma.transaction.create({
      data: {
        userId: session.userId,
        amount: parseFloat(amount),
        type: "SEND",
        status: "SUCCESS",
        phone: "", // Not applicable for wallet transfers
        recipientAddress: recipient,
        resultCode: 0,
        resultDesc: "Transfer completed successfully",
        transactionDate: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transfer completed successfully",
    });
  } catch (error) {
    console.error("Transfer error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("insufficient balance")) {
        return NextResponse.json(
          { error: "Insufficient balance for this transfer" },
          { status: 400 }
        );
      }
      if (error.message.includes("destination account does not exist")) {
        return NextResponse.json(
          { error: "Recipient wallet not found or inactive" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Transfer failed. Please try again." },
      { status: 500 }
    );
  }
}
