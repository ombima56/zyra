"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-white text-center mb-4">
        Send money like a message.
      </h1>
      <p className="text-lg text-white/70 max-w-xl text-center mb-6">
        Zyra lets you chat and transfer funds instantly—across borders, with no
        fees or friction. Built on Stellar for speed, security, and freedom.
      </p>

      {/* 👇 Use Link from next/link */}
      <Link href="/login">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition">
          Get Started
        </button>
      </Link>
    </main>
  );
}
