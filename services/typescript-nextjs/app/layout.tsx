import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "Guestbook",
  description: "A Next.js guestbook on Encore",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
