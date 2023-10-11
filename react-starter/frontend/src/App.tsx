import {
  createBrowserRouter,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useFetcher,
  useRouteError,
  useRouteLoaderData,
} from "react-router-dom";
import { fakeAuthProvider } from "./lib/auth";
import LoginPage, {
  loginAction,
  loginLoader,
} from "./components/LoginPage.tsx";
import UserDetailsPage, {
  userDetailsLoader,
} from "./components/UserDetailsPage.tsx";
import UserListPage, { userListLoader } from "./components/UserListPage.tsx";
import IndexPage from "./components/IndexPage.tsx";

import "./App.css";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return { isAuthenticated: fakeAuthProvider.isAuthenticated };
    },
    Component: Layout,
    children: [
      {
        path: "",
        element: <Outlet />,
        ErrorBoundary: ErrorBoundary,
        children: [
          {
            index: true,
            Component: IndexPage,
          },
          {
            path: "login",
            action: loginAction,
            loader: loginLoader,
            Component: LoginPage,
          },
          {
            path: "/logout",
            action() {
              fakeAuthProvider.signout();
              return redirect("/");
            },
          },
          {
            path: "users",
            element: <Outlet />,
            children: [
              {
                index: true,
                Component: UserListPage,
                loader: userListLoader,
              },
              {
                path: ":id",
                loader: userDetailsLoader,
                Component: UserDetailsPage,
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
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}

function Layout() {
  return (
    <div>
      <header>
        <nav className="nav">
          <div className="navLinks">
            <Link to="/">Home</Link>
            <Link to="/users">User List</Link>
          </div>

          <AuthStatus />
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

function AuthStatus() {
  const { isAuthenticated } = useRouteLoaderData("root") as {
    isAuthenticated: boolean;
  };
  const fetcher = useFetcher();

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  return (
    <fetcher.Form method="post" action="/logout">
      <button type="submit">Sign out</button>
    </fetcher.Form>
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
