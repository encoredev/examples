import { api } from "encore.dev/api";
import { getWorkOS } from "./auth";
import { handleWorkOSError } from "./auth.helpers";

interface ForgotPasswordRequest {
	email: string;
	passwordResetUrl: string;
}

interface ForgotPasswordResponse {
	success: true;
}

export const forgotPassword = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/forgot-password",
	},
	async (req: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
		try {
			await getWorkOS().userManagement.sendPasswordResetEmail({
				email: req.email,
				passwordResetUrl: req.passwordResetUrl,
			});
		} catch {
			// Always return success to prevent email enumeration
		}

		return { success: true };
	},
);

interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

interface ResetPasswordResponse {
	success: true;
}

export const resetPassword = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/reset-password",
	},
	async (req: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
		try {
			await getWorkOS().userManagement.resetPassword({
				token: req.token,
				newPassword: req.newPassword,
			});

			return { success: true };
		} catch (error: unknown) {
			handleWorkOSError(error, "Failed to reset password");
		}
	},
);
