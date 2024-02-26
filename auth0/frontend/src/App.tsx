import { PropsWithChildren } from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { Auth0Provider } from "./lib/auth";
import AdminDashboard from "./components/AdminDashboard.tsx";

import IndexPage from "./components/IndexPage.tsx";
import "./App.css";
import LoginStatus from "./components/LoginStatus.tsx";

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
            // Login route
            path: "login",
            loader: async ({ request }) => {
              const url = new URL(request.url);
              const searchParams = new URLSearchParams(url.search);
              const returnToURL = searchParams.get("returnTo") ?? "/";

              if (Auth0Provider.isAuthenticated()) return redirect(returnToURL);

              try {
                const returnURL = await Auth0Provider.login(returnToURL);
                return redirect(returnURL);
              } catch (error) {
                throw new Error("Login failed");
              }
            },
          },
          {
            // Callback route, redirected to from Auth0 after login
            path: "callback",
            loader: async ({ request }) => {
              const url = new URL(request.url);
              const searchParams = new URLSearchParams(url.search);
              const state = searchParams.get("state");
              const code = searchParams.get("code");

              if (!state || !code) throw new Error("Login failed");

              try {
                const redirectURL = await Auth0Provider.validate(state, code);
                return redirect(redirectURL);
              } catch (error) {
                throw new Error("Login failed");
              }
            },
          },
          {
            // Logout route
            path: "logout",
            loader: async () => {
              try {
                const redirectURL = await Auth0Provider.logout();
                return redirect(redirectURL);
              } catch (error) {
                throw new Error("Logout failed");
              }
            },
          },
          {
            element: <Outlet />,
            // Redirect to /login if not authenticated
            loader: async ({ request }) => {
              if (!Auth0Provider.isAuthenticated()) {
                const params = new URLSearchParams();
                params.set("returnTo", new URL(request.url).pathname);
                return redirect("/login?" + params.toString());
              }
              return null;
            },
            // Protected routes
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

function ErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message || JSON.stringify(error)}</p>
    </div>
  );
}
