import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        className="hidden lg:flex"
        src="/library_logo.png"
        width={160}
        height={120}
        alt="library logo"
      />
      <Image
        className="flex lg:hidden"
        src="/library_logo.png"
        width={160}
        height={120}
        alt="library logo"
      />
    </Link>
  );
}
