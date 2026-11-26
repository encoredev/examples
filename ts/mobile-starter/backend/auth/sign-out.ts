import { api } from "encore.dev/api";

interface SignOutRequest {
	sessionId?: string;
}

interface SignOutResponse {
	success: true;
}

export const signOut = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/sign-out",
	},
	async (_req: SignOutRequest): Promise<SignOutResponse> => {
		return { success: true };
	},
);
