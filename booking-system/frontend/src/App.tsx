import React from "react";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import BookingCalendarPage from "./components/pages/BookingCalendarPage";
import HeaderNav from "./components/HeaderNav";
import LoginPage, { action as loginAction } from "./components/pages/LoginPage";
import AdminLayout from "./components/AdminLayout";
import AdminCalendarPage from "./components/pages/AdminCalendarPage";
import AvailabilitySettingsPage, {
  action as availabilityAction,
} from "./components/pages/AvailabilitySettingsPage";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter([
  {
    id: "root",
    path: "frontend",
    children: [
      {
        path: "",
        element: (
          <div className="flex flex-col h-screen">
            <HeaderNav />
            <Outlet />
          </div>
        ),
        children: [
          {
            index: true,
            element: <BookingCalendarPage />,
          },
          {
            path: "login",
            action: loginAction,
            element: <LoginPage />,
          },
        ],
      },
      {
        path: "logout",
        loader() {
          Cookies.remove("auth-token");
          return redirect("/frontend/");
        },
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminCalendarPage />,
          },
          {
            path: "availability",
            action: availabilityAction(queryClient),
            element: <AvailabilitySettingsPage />,
            errorElement: <AvailabilitySettingsPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        fallbackElement={<p>Initial Load...</p>}
      />
    </QueryClientProvider>
  );
}

export default App;
