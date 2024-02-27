import React, { PropsWithChildren, useContext, useEffect } from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { signOut } from "firebase/auth";
import AdminDashboard from "./components/AdminDashboard.tsx";

import IndexPage from "./components/IndexPage.tsx";
import "./App.css";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import { FirebaseContext, FirebaseProvider } from "./lib/firebase.tsx";

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
            path: "login",
            Component: Login,
          },
          {
            path: "signup",
            Component: Signup,
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
    <FirebaseProvider>
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </FirebaseProvider>
  );
}

function Layout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const { auth, isLoading } = useContext(FirebaseContext);
  const user = auth?.currentUser;
  const logoutUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (auth) {
      await signOut(auth);
      navigate("/");
    }
  };

  return (
    <div>
      <header>
        <nav className="nav">
          <div className="navLinks">
            <Link to="/">Home</Link>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </div>

          <div>
            {!isLoading && (
              <>
                {user?.uid ? (
                  <button onClick={logoutUser}>Logout</button>
                ) : (
                  <Link to="/login">
                    <button>Login</button>
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main">{children ?? <Outlet />}</main>
    </div>
  );
}

function ProtectedRoutes() {
  const navigate = useNavigate();
  const { auth, isLoading } = useContext(FirebaseContext);

  useEffect(() => {
    if (!isLoading && !auth?.currentUser?.uid) navigate("/login");
  }, [isLoading, auth]);

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
