import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full h-24 p-6 flex justify-between items-center bg-[var(--white)] shadow-2xl">
      <h1 className="text-4xl font-bold text-[var(--primary)]">Audio Soul</h1>
      <nav className="flex space-x-6">
        <Link
          href="/DAW"
          className="text-[var(--fourth)] hover:text-[var(--primary)] transition-colors"
        >
          Create
        </Link>
        <Link
          href="/buy"
          className="text-[var(--fourth)] hover:text-[var(--primary)] transition-colors"
        >
          Buy
        </Link>
        <Link
          href="/blog"
          className="text-[var(--fourth)] hover:text-[var(--primary)] transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/about"
          className="text-[var(--fourth)] hover:text-[var(--primary)] transition-colors"
        >
          That&apos;s me
        </Link>
      </nav>
    </div>
  );
};

export default Header;
