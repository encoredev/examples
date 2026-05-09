import { redirect } from "@tanstack/react-router";
import {
	hasPermission,
	mapRole,
	type Permission,
	type RoleType,
} from "@/lib/permissions";

function decodeJwtPayload(token: string): Record<string, unknown> {
	const base64 = token.split(".")[1];
	const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
	return JSON.parse(json);
}

function getRoleFromContext(context: {
	auth: { user: unknown; accessToken?: string | null };
}): RoleType | null {
	if (!context.auth.user) return null;
	if (!context.auth.accessToken) return null;
	try {
		const payload = decodeJwtPayload(context.auth.accessToken);
		return mapRole((payload.role as string) || undefined);
	} catch {
		return null;
	}
}

export function requireRoutePermission(
	context: {
		auth: {
			user: unknown;
			isLoading: boolean;
			accessToken?: string | null;
		};
	},
	permission: Permission,
): void {
	if (!context.auth.isLoading && !context.auth.user) {
		throw redirect({ to: "/login" });
	}
	const role = getRoleFromContext(
		context as { auth: { user: unknown; accessToken?: string | null } },
	);
	if (!role || !hasPermission(role, permission)) {
		throw redirect({ to: "/login" });
	}
}
