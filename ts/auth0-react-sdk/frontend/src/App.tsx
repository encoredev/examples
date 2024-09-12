import { PropsWithChildren, useEffect } from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard.tsx";

import IndexPage from "./components/IndexPage.tsx";
import "./App.css";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import LoginStatus from "./components/LoginStatus.tsx";

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
  throw new Error("Missing Auth0 credentials");
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
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: AUTH0_AUDIENCE,
        scope: "profile email",
      }}
    >
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </Auth0Provider>
  );
}

function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <header>
        <nav className="nav">
          <div className="navLinks">
            <Link to="/">Home</Link>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </div>

          <LoginStatus />
        </nav>
      </header>

      <main className="main">{children ?? <Outlet />}</main>
    </div>
  );
}

function ProtectedRoutes() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  useEffect(() => {
    if (!isAuthenticated && !isLoading) loginWithRedirect();
  }, [isAuthenticated, isLoading]);

  if (isLoading) return "Loading...";

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
