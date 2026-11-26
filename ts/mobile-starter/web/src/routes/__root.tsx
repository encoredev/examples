import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { useAuth } from "@/features/auth/lib/auth-provider";
import "../index.css";

export type RouterAppContext = { auth: ReturnType<typeof useAuth> };

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
});

function RootComponent() {
	return <Outlet />;
}
