import { createFileRoute } from "@tanstack/react-router";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppSession } from "@/features/auth/lib/auth-session";
import { P } from "@/lib/permissions";
import { requireRoutePermission } from "@/features/auth/lib/route-guard";

export const Route = createFileRoute("/_app/profile")({
	beforeLoad: ({ context }) => {
		requireRoutePermission(context, P.PROFILE_VIEW);
	},
	component: Profile,
});

function Profile() {
	const { session } = useAppSession();

	if (!session) return null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-text">Profile</h1>
				<p className="text-sm text-text-secondary">Your account details</p>
			</div>

			<Card>
				<div className="space-y-4">
					<div>
						<CardTitle>Name</CardTitle>
						<CardDescription>{session.name}</CardDescription>
					</div>
					<div>
						<CardTitle>Email</CardTitle>
						<CardDescription>{session.email}</CardDescription>
					</div>
					<div>
						<CardTitle>Role</CardTitle>
						<CardDescription>
							<span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium capitalize text-primary">
								{session.role}
							</span>
						</CardDescription>
					</div>
					<div>
						<CardTitle>Organization</CardTitle>
						<CardDescription>{session.organizationName}</CardDescription>
					</div>
					<div>
						<CardTitle>User ID</CardTitle>
						<CardDescription className="font-mono text-xs">
							{session.userId}
						</CardDescription>
					</div>
				</div>
			</Card>
		</div>
	);
}
