"use client";

import React from "react";
import Link from "next/link";

export default function LinkBtn({
  href,
  text,
  isExternal = false,
  size = "md",
  variant = "primary",
}: {
  href: string;
  text: string;
  isExternal?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}) {
  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-lg",
    lg: "py-4 px-8 text-xl",
  };

  const variantClasses = {
    primary:
      "bg-[var(--text-third)] hover:bg-[var(--primary)] outline-[var(--primary)]",
    secondary: "bg-gray-500 hover:bg-gray-600 outline-gray-700",
    // Weitere Varianten hinzufügen
  };

  const baseClasses = `text-white font-bold rounded-full transition-colors outline outline-offset-4 hover:outline-offset-2 animate-pulse hover:animate-none flex items-center justify-center ${
    sizeClasses[size] || sizeClasses.md
  } ${variantClasses[variant] || variantClasses.primary}`;

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {text}
      </a>
    );
  }

  return (
    <Link href={href}>
      <a className={baseClasses}>{text}</a>
    </Link>
  );
}
