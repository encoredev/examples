import { cn } from "@/lib/cn";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClientProvider } from "./query-client-provider";

import "./globals.css";

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
		template: "%s | Encore.ts SaaS Starter",
		default: "Encore.ts SaaS Starter",
	},
	description:
		"An SaaS Starter template using Encore.ts, Nextjs, Clerk, Stripe, Tailwind and shadcn/ui.",
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
					<QueryClientProvider>{children}</QueryClientProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
