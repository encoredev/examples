import type {LinksFunction, LoaderFunction} from "@remix-run/node";
import {ClerkApp, SignedIn, SignedOut, UserButton} from "@clerk/remix";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {rootAuthLoader} from "@clerk/remix/ssr.server";
import {ReactNode} from "react";

import "./tailwind.css"

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async (args) => {
  return rootAuthLoader(args)
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return (
    <div>
      <header>
        <nav className="nav">
          <div className="navLinks">
            <Link to="/">Home</Link>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </div>

          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link to="/sign-in">
                <button>Sign In</button>
              </Link>
            </SignedOut>
          </div>
        </nav>
      </header>

      <main className="main"><Outlet/></main>
    </div>
  )
}

export default ClerkApp(App)
