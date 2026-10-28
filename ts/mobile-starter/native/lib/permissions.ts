export const P = {
	DASHBOARD_VIEW: "dashboard:view",
	PROFILE_VIEW: "profile:view",
	PROFILE_EDIT: "profile:edit",
	MEMBERS_VIEW: "members:view",
	MEMBERS_INVITE: "members:invite",
	MEMBERS_REMOVE: "members:remove",
} as const;

export type Permission = (typeof P)[keyof typeof P];

export type RoleType = "admin" | "member";

export const ROLE_PERMISSIONS: Record<RoleType, Set<Permission>> = {
	admin: new Set([
		P.DASHBOARD_VIEW,
		P.PROFILE_VIEW,
		P.PROFILE_EDIT,
		P.MEMBERS_VIEW,
		P.MEMBERS_INVITE,
		P.MEMBERS_REMOVE,
	]),
	member: new Set([
		P.DASHBOARD_VIEW,
		P.PROFILE_VIEW,
		P.PROFILE_EDIT,
		P.MEMBERS_VIEW,
	]),
};

export function hasPermission(role: RoleType, permission: Permission): boolean {
	return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

const VALID_ROLES = new Set<string>(["admin", "member"]);

export function mapRole(slug?: string): RoleType {
	if (!slug) return "member";
	return VALID_ROLES.has(slug) ? (slug as RoleType) : "member";
}
