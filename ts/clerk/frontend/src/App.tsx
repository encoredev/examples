import { PropsWithChildren, useEffect } from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard.tsx";

import IndexPage from "./components/IndexPage.tsx";
import "./App.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useAuth,
  UserButton,
} from "@clerk/clerk-react"; // Import your publishable key

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Application routes
const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
    children: [
      {
        Component: Outlet,
        children: [
          {
            index: true,
            Component: IndexPage,
          },
          {
            path: "sign-in",
            element: (
              <div className="center">
                <SignIn signUpUrl="/sign-up" />
              </div>
            ),
          },
          {
            path: "sign-up",
            element: (
              <div className="center">
                <SignUp signInUrl="/sign-in" />
              </div>
            ),
          },
          {
            Component: ProtectedRoutes,
            children: [
              {
                path: "admin-dashboard",
                Component: AdminDashboard,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

function Layout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div>
        <header>
          <nav className="nav">
            <div className="navLinks">
              <Link to="/">Home</Link>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </div>

            <div>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in">
                  <button>Sign In</button>
                </Link>
              </SignedOut>
            </div>
          </nav>
        </header>

        <main className="main">{children ?? <Outlet />}</main>
      </div>
    </ClerkProvider>
  );
}

function ProtectedRoutes() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to sign-in page if user is not logged in
    if (isLoaded && !userId) navigate("/sign-in");
  }, [isLoaded, userId]);

  if (!isLoaded) return "Loading...";

  return <Outlet />;
}

function ErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message || JSON.stringify(error)}</p>
    </div>
  );
}
