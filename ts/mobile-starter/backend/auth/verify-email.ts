import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getWorkOS } from "./auth";
import { handleWorkOSError, toAuthResult, type UserInfo } from "./auth.helpers";
import {
	getOrgName,
	isOrgSelectionRequired,
	resolveOrgAuthByUserId,
} from "./org-auth";

const workOSClientId = secret("WorkOSClientId");

interface VerifyEmailRequest {
	code: string;
	pendingAuthenticationToken: string;
}

interface VerifyEmailResponse {
	accessToken: string;
	refreshToken: string;
	user: UserInfo;
	organizationName?: string;
}

async function authenticateWithVerificationCode(
	code: string,
	pendingAuthenticationToken: string,
): Promise<VerifyEmailResponse> {
	const response =
		await getWorkOS().userManagement.authenticateWithEmailVerification({
			clientId: workOSClientId(),
			code,
			pendingAuthenticationToken,
		});

	const organizationName = await getOrgName(response);
	return { ...toAuthResult(response), organizationName };
}

export const verifyEmail = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/verify-email",
	},
	async (req: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
		try {
			return await authenticateWithVerificationCode(
				req.code,
				req.pendingAuthenticationToken,
			);
		} catch (error: unknown) {
			const orgSelection = isOrgSelectionRequired(error);
			if (orgSelection?.userId) {
				const orgResult = await resolveOrgAuthByUserId(
					orgSelection.userId,
					orgSelection.pendingToken,
				);
				if (orgResult) {
					return {
						...toAuthResult(orgResult.response),
						organizationName: orgResult.organizationName,
					};
				}
			}

			handleWorkOSError(error, "Failed to verify email");
		}
	},
);
