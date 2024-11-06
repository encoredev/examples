import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Encore + Next.js",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Admin Dashboard" },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("auth-token");

  return (
    <html lang="en">
      <body className={`${inter.className} text-black bg-white`}>
        <header>
          <nav className="h-navBar bg-black text-white flex items-center justify-between p-5">
            <div className="flex items-center">
              {navLinks.map(({ href, label }) => (
                <Link
                  className="mr-8 text-inherit hover:underline"
                  key={href}
                  href={href}
                >
                  {label}
                </Link>
              ))}
            </div>

            {isLoggedIn ? (
              <form action="/auth/logout" method="post">
                <button type="submit">Logout</button>
              </form>
            ) : (
              <form className="space-x-2" action="/auth/login" method="post">
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <button type="submit">Login</button>
              </form>
            )}
          </nav>
        </header>

        <main className="flex w-full p-10">{children}</main>
      </body>
    </html>
  );
}
