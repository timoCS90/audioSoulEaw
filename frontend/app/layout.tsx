import { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Audio Soul",
  description: "Create your music online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
