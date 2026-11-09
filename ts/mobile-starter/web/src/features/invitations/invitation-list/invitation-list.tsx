import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { usePermissions } from "@/features/auth/lib/use-permissions";
import { P } from "@/lib/permissions";
import { Button } from "@/components/ui/button";

export function InvitationList() {
	const { can } = usePermissions();

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["invitations"],
		queryFn: () => apiClient.auth.listInvitations(),
	});

	const handleRevoke = async (id: string) => {
		try {
			await apiClient.auth.revokeInvitation({ id });
			refetch();
		} catch {
			// Error handled silently
		}
	};

	if (isLoading) {
		return <p className="text-sm text-text-secondary">Loading invitations...</p>;
	}

	const invitations = data?.invitations ?? [];

	if (invitations.length === 0) {
		return (
			<p className="text-sm text-text-secondary">No pending invitations.</p>
		);
	}

	return (
		<div className="space-y-2">
			<h3 className="font-semibold text-text">Pending Invitations</h3>
			<div className="divide-y divide-border rounded-lg border border-border">
				{invitations.map((inv) => (
					<div
						key={inv.id}
						className="flex items-center justify-between px-4 py-3"
					>
						<div>
							<p className="text-sm font-medium text-text">{inv.email}</p>
							<p className="text-xs text-text-secondary">
								Status: {inv.status}
							</p>
						</div>
						{can(P.MEMBERS_REMOVE) && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleRevoke(inv.id)}
								className="text-error hover:text-error hover:bg-error-muted"
							>
								Revoke
							</Button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
