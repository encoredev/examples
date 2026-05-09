import { createFileRoute } from "@tanstack/react-router";
import { P } from "@/lib/permissions";
import { requireRoutePermission } from "@/features/auth/lib/route-guard";
import { usePermissions } from "@/features/auth/lib/use-permissions";
import { InviteForm } from "@/features/invitations/invite-form/invite-form";
import { InvitationList } from "@/features/invitations/invitation-list/invitation-list";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/members")({
	beforeLoad: ({ context }) => {
		requireRoutePermission(context, P.MEMBERS_VIEW);
	},
	component: Members,
});

function Members() {
	const { can } = usePermissions();
	const queryClient = useQueryClient();

	const handleInviteSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ["invitations"] });
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-text">Members</h1>
				<p className="text-sm text-text-secondary">
					Manage your organization members
				</p>
			</div>

			{can(P.MEMBERS_INVITE) && (
				<InviteForm onSuccess={handleInviteSuccess} />
			)}

			<InvitationList />
		</div>
	);
}
