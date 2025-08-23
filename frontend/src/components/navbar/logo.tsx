"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src="/assets/logo-zrya.png"
        alt="Zyra Logo"
        width={45}
        height={45}
        priority
      />
      <span className="font-semibold text-lg">Zyra</span>
    </Link>
  );
};
