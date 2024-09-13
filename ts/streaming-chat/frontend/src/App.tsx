import {
  createHashRouter,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import IndexPage from "./components/IndexPage.tsx";
import Chat from "./components/Chat.tsx";

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
            Component: Outlet,
            loader: ({ request }) => {
              const url = new URL(request.url);
              const username = url.searchParams.get("name");
              if (!username) return redirect("/");
              return null;
            },
            children: [
              {
                path: "chat",
                Component: Chat,
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
        <nav className="flex items-center justify-between bg-black text-white p-4">
          <Link to="/">Home</Link>
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
