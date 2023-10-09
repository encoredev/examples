import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Encore + Next.js",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/users", label: "User List" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = cookies().has("auth-token");

  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav className={styles.nav}>
            <div className={styles.navLinks}>
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>

            {isLoggedIn ? (
              <form action="/auth/logout" method="post">
                <button type="submit">Logout</button>
              </form>
            ) : (
              <form action="/auth/login" method="post">
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <button type="submit">Login</button>
              </form>
            )}
          </nav>
        </header>

        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
