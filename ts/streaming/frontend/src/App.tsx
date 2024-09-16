import {
  createHashRouter,
  Link,
  Outlet,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import IndexPage from "./components/IndexPage.tsx";
import StreamOutExample from "./components/StreamOutExample.tsx";
import StreamInExample from "./components/StreamInExample.tsx";
import StreamInOutExample from "./components/StreamInOutExample.tsx";

const router = createHashRouter([
  {
    id: "root",
    path: "/",
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
            children: [
              {
                path: "stream-in",
                Component: StreamInExample,
              },
              {
                path: "stream-out",
                Component: StreamOutExample,
              },
              {
                path: "stream-in-out",
                Component: StreamInOutExample,
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
        <nav className="flex items-center bg-black text-white p-4 space-x-4">
          <Link to="/">Home</Link>
          <Link to="/stream-in">streamIn</Link>
          <Link to="/stream-out">streamOut</Link>
          <Link to="/stream-in-out">streamInOut</Link>
        </nav>
      </header>

      <main className="flex w-full p-8">
        <Outlet />
      </main>
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
