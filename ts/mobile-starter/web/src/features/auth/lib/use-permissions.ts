import { hasPermission, type Permission } from "@/lib/permissions";
import { useAppSession } from "./auth-session";

export function usePermissions() {
	const { session } = useAppSession();
	return {
		can: (permission: Permission) =>
			session ? hasPermission(session.role, permission) : false,
	};
}
