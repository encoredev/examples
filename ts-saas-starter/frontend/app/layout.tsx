import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import Navbar from "../components/Navbar";
import {ProfileImageProvider} from "../context/ProfileImageContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "SaaS Template",
    description: "Modern SaaS template with authentication and subscription management",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="light" style={{colorScheme: 'light'}} suppressHydrationWarning>
        <body className={inter.className}>

        <ProfileImageProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </ProfileImageProvider>

        </body>
        </html>
    );
}