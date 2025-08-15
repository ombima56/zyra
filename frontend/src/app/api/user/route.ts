import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Return only necessary user data, not the secret key directly
  return NextResponse.json({
    publicKey: session.user.publicKey,
    email: session.user.email,
    phone: session.user.phone,
    // Add other user data you might need on the client
  });
}
