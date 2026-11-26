"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {Button} from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {LogOut} from "lucide-react";
import {authClient} from "../lib/auth_client";
import {ProfileImage} from "./ProfileImage";
import React, {useEffect, useState} from "react";
import {useProfileImage} from "../context/ProfileImageContext";

export default function Navbar() {
    const router = useRouter();
    // Add clientLoaded state to prevent hydration mismatch
    const [clientLoaded, setClientLoaded] = useState(false);
    const {data: session, isPending} = authClient.useSession();
    // Use the shared profile image context
    const {imageUrl, isLoading: isImageLoading, isAuthenticated} = useProfileImage();

    // Set clientLoaded to true after first render
    useEffect(() => {
        setClientLoaded(true);
    }, []);

    // Handle user sign out
    const handleSignOut = async () => {
        try {
            // Sign out with Better Auth
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login");
                    }
                }
            });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Return a simplified version during SSR to prevent hydration errors
    if (!clientLoaded) {
        return (
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <div className="h-6 w-6 rounded-full bg-primary"/>
                            <span>SaaS Template</span>
                        </Link>
                    </div>
                    <nav className="flex items-center gap-4 sm:gap-6"></nav>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <div className="h-6 w-6 rounded-full bg-primary"/>
                        <span>SaaS Template</span>
                    </Link>
                </div>

                <nav className="flex items-center gap-4 sm:gap-6">
                    {isPending ? (
                        // Loading state
                        <div
                            className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    ) : session ? (
                        // Logged in state
                        <div className="flex items-center gap-4">
                            {/* User info for larger screens */}
                            <span className="hidden md:inline text-sm font-medium">
                                {session.user.name}
                              </span>

                            {/* User dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        {isAuthenticated && (
                                            <ProfileImage
                                                name={session.user.name || ""}
                                                imageUrl={imageUrl}
                                                isLoading={isImageLoading}
                                                size="md"
                                            />
                                        )}
                                        <span className="sr-only">User Menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        // Logged out state
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium hover:underline underline-offset-4"
                            >
                                Log In
                            </Link>
                            <Button asChild size="sm">
                                <Link href="/signup">
                                    Sign Up Free
                                </Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}