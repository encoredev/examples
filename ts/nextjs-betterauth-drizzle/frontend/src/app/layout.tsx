import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Encore + Next.js + Better Auth",
  description: "Full-stack authentication starter with Encore.ts, Next.js, Better Auth, and Drizzle",
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

