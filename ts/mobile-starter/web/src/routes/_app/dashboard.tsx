import { createFileRoute } from "@tanstack/react-router";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppSession } from "@/features/auth/lib/auth-session";
import { P } from "@/lib/permissions";
import { requireRoutePermission } from "@/features/auth/lib/route-guard";

export const Route = createFileRoute("/_app/dashboard")({
	beforeLoad: ({ context }) => {
		requireRoutePermission(context, P.DASHBOARD_VIEW);
	},
	component: Dashboard,
});

function Dashboard() {
	const { session } = useAppSession();

	if (!session) return null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-text">Dashboard</h1>
				<p className="text-sm text-text-secondary">
					Welcome back, {session.name}
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardTitle>Role</CardTitle>
					<CardDescription>
						<span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium capitalize text-primary">
							{session.role}
						</span>
					</CardDescription>
				</Card>

				<Card>
					<CardTitle>Organization</CardTitle>
					<CardDescription>{session.organizationName}</CardDescription>
				</Card>

				<Card>
					<CardTitle>Email</CardTitle>
					<CardDescription>{session.email}</CardDescription>
				</Card>
			</div>
		</div>
	);
}
