import prisma from "./prisma";
import { cookies } from "next/headers";

const SESSION_EXPIRATION_DAYS = 7; // Sessions expire in 7 days

export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000); // 7 days from now

  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  const cookieStore = cookies();
  cookieStore.set("sessionId", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    expires: expiresAt,
    path: "/", // Accessible across the entire site
    sameSite: "lax", // CSRF protection
  });

  return session.id;
}

export async function getSession() {
  const cookieStore = cookies(); // Await the cookies() call
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }, // Include user data with the session
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    cookieStore.delete("sessionId");
    return null;
  }

  return session;
}

export async function deleteSession() {
  const cookieStore = cookies(); // Await the cookies() call
  const sessionId = cookieStore.get("sessionId")?.value;

  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } });
  }
  cookieStore.delete("sessionId");
}
