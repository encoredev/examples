import type { auth } from "@/lib/api/client.gen";
import type { RoleType } from "@/lib/permissions";

export interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: auth.UserInfo | null;
	accessToken: string | null;
	role: RoleType;
	organizationId: string;
	organizationName: string;
}

export interface AuthContextType extends AuthState {
	signIn: (email: string, password: string) => Promise<auth.SignInResponse>;
	signUp: (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
	) => Promise<auth.SignUpResponse>;
	signOut: () => Promise<void>;
	storeSession: (result: auth.RefreshResponse) => Promise<void>;
}
