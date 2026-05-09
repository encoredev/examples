import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { mapRole, type RoleType } from "./permissions";

interface SessionResponse {
	userID: string;
	email: string;
	role: RoleType;
	organizationId: string;
}

export const getSession = api(
	{
		expose: true,
		auth: true,
		method: "GET",
		path: "/api/auth/session",
	},
	async (): Promise<SessionResponse> => {
		const authData = getAuthData()!;

		return {
			userID: authData.userID,
			email: authData.email,
			role: mapRole(authData.role),
			organizationId: authData.organizationId,
		};
	},
);
