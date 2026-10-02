import { mapRole, type RoleType } from "@/lib/permissions";
import { useAuth } from "./auth-provider";

export interface Session {
	userId: string;
	email: string;
	name: string;
	role: RoleType;
	organizationId: string;
	organizationName: string;
	accessToken: string;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
	const base64 = token.split(".")[1];
	const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
	return JSON.parse(json);
}

export function useAppSession(): {
	session: Session | null;
	isLoaded: boolean;
} {
	const { user, isLoading, accessToken } = useAuth();
	const isLoaded = !isLoading;

	if (!isLoaded || !user) {
		return { session: null, isLoaded };
	}

	let role = "";
	let organizationId = "";
	if (accessToken) {
		try {
			const payload = decodeJwtPayload(accessToken);
			role = (payload.role as string) ?? "";
			organizationId = (payload.org_id as string) ?? "";
		} catch {
			/* invalid token */
		}
	}

	const mappedRole = mapRole(role || undefined);
	const name =
		`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;

	return {
		session: {
			userId: user.id,
			email: user.email,
			name,
			role: mappedRole,
			organizationId,
			organizationName:
				localStorage.getItem("organizationName") || organizationId,
			accessToken: accessToken ?? "",
		},
		isLoaded,
	};
}
