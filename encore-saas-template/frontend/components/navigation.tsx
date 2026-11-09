'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/app/lib/firebase/FirebaseProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";

export function Navigation() {
  const { user, logout } = useFirebase();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black backdrop-blur-sm border-b border-zinc-800">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              EncoreKit
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-zinc-300 hover:text-white transition-colors">
              Pricing
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-zinc-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                      <Avatar className="h-8 w-8 hover:opacity-80 transition-opacity">
                        <AvatarFallback className="bg-white text-black">
                          {user.email ? user.email[0].toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="bg-[#232323] border-zinc-800"
                    >
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-white truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <Link href="/dashboard">
                        <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-zinc-300 hover:text-white focus:text-white cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signup">
                  <Button className="bg-zinc-200 hover:bg-zinc-300">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 