import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { submitSignedTransaction } from "@/lib/stellar"; // Assuming this new function will be created
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { signedTransactionXDR, recipient, amount } = await request.json();

    // Validate inputs
    if (!signedTransactionXDR || !recipient || !amount) {
      return NextResponse.json(
        { error: "Missing signed transaction XDR, recipient, or amount" },
        { status: 400 }
      );
    }

    // Submit the pre-signed transaction to the Stellar network
    await submitSignedTransaction(signedTransactionXDR);

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
