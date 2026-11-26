import { APIError, api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { getWorkOS } from "./auth";
import { requirePermission } from "./auth.helpers";
import { P } from "./permissions";

interface SendInvitationRequest {
	email: string;
	role: string;
}

interface SendInvitationResponse {
	invitationId: string;
	email: string;
	status: string;
}

export const sendInvitation = api(
	{
		expose: true,
		auth: true,
		method: "POST",
		path: "/api/auth/invitations",
	},
	async (req: SendInvitationRequest): Promise<SendInvitationResponse> => {
		requirePermission(P.MEMBERS_INVITE);
		const authData = getAuthData();
		if (!authData?.organizationId) {
			throw APIError.permissionDenied("no organization context");
		}

		const workos = getWorkOS();
		const invitation = await workos.userManagement.sendInvitation({
			email: req.email,
			organizationId: authData.organizationId,
			roleSlug: req.role,
			inviterUserId: authData.userID,
		});

		return {
			invitationId: invitation.id,
			email: invitation.email,
			status: invitation.state,
		};
	},
);

interface InvitationItem {
	id: string;
	email: string;
	status: string;
	createdAt: string;
	expiresAt: string;
}

interface ListInvitationsResponse {
	invitations: InvitationItem[];
}

export const listInvitations = api(
	{
		expose: true,
		auth: true,
		method: "GET",
		path: "/api/auth/invitations",
	},
	async (): Promise<ListInvitationsResponse> => {
		requirePermission(P.MEMBERS_VIEW);
		const authData = getAuthData();
		if (!authData?.organizationId) {
			throw APIError.permissionDenied("no organization context");
		}

		const workos = getWorkOS();
		const result = await workos.userManagement.listInvitations({
			organizationId: authData.organizationId,
		});

		return {
			invitations: result.data.map((inv) => ({
				id: inv.id,
				email: inv.email,
				status: inv.state,
				createdAt: inv.createdAt,
				expiresAt: inv.expiresAt,
			})),
		};
	},
);

interface RevokeInvitationRequest {
	id: string;
}

export const revokeInvitation = api(
	{
		expose: true,
		auth: true,
		method: "DELETE",
		path: "/api/auth/invitations/:id",
	},
	async (req: RevokeInvitationRequest): Promise<void> => {
		requirePermission(P.MEMBERS_REMOVE);
		const authData = getAuthData();
		if (!authData?.organizationId) {
			throw APIError.permissionDenied("no organization context");
		}

		const workos = getWorkOS();
		const invitation = await workos.userManagement.getInvitation(req.id);
		if (invitation.organizationId !== authData.organizationId) {
			throw APIError.permissionDenied(
				"invitation belongs to another organization",
			);
		}

		await workos.userManagement.revokeInvitation(req.id);
	},
);
