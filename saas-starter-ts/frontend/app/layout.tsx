import { ClerkProvider } from "@clerk/nextjs";
import {
  QueryClientProvider,
} from './query-client-provider'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/cn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Encore.go SaaS Starter",
    default: "Encore.go SaaS Starter",
  },
  description:
    "An SaaS Starter template using Encore.go, Nextjs, Clerk, Stripe, Tailwind, shadcn/ui etc.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", geistSans.variable, geistMono.variable)}
      >
        <ClerkProvider>
          <QueryClientProvider>
            {children}
          </QueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
