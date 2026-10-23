import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/lib/auth-provider";
import { useAppSession } from "@/features/auth/lib/auth-session";

export const Route = createFileRoute("/_app")({
	beforeLoad: ({ context }) => {
		if (!context.auth.isLoading && !context.auth.user) {
			throw redirect({ to: "/login" });
		}
	},
	component: AppLayout,
});

function AppLayout() {
	const { signOut } = useAuth();
	const { session } = useAppSession();

	return (
		<div className="min-h-screen bg-surface">
			<header className="border-b border-border bg-surface-elevated">
				<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
					<nav className="flex items-center gap-6">
						<Link
							to="/_app/dashboard"
							className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text [&.active]:text-primary"
						>
							<LayoutDashboard size={16} />
							Dashboard
						</Link>
						<Link
							to="/_app/members"
							className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text [&.active]:text-primary"
						>
							<Users size={16} />
							Members
						</Link>
						<Link
							to="/_app/profile"
							className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text [&.active]:text-primary"
						>
							<User size={16} />
							Profile
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						{session && (
							<span className="text-xs text-text-secondary">
								{session.name} ({session.role})
							</span>
						)}
						<button
							onClick={signOut}
							className="flex items-center gap-1 text-sm text-text-secondary hover:text-text"
						>
							<LogOut size={16} />
							Sign out
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}
