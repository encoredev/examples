import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getWorkOS } from "./auth";
import {
	getPendingToken,
	handleWorkOSError,
	isOauthException,
	toAuthResult,
	type UserInfo,
} from "./auth.helpers";
import { getOrgName, isOrgSelectionRequired, resolveOrgAuth } from "./org-auth";

const workOSClientId = secret("WorkOSClientId");

interface SignInRequest {
	email: string;
	password: string;
}

interface SignInResponse {
	status: "complete" | "mfa_required" | "verify_email";
	accessToken?: string;
	refreshToken?: string;
	user?: UserInfo;
	pendingAuthenticationToken?: string;
	organizationName?: string;
}

function pendingResponse(
	status: "mfa_required" | "verify_email",
	pendingAuthenticationToken?: string,
): SignInResponse {
	return { status, pendingAuthenticationToken };
}

async function authenticateWithPassword(
	email: string,
	password: string,
): Promise<SignInResponse> {
	try {
		const response = await getWorkOS().userManagement.authenticateWithPassword({
			clientId: workOSClientId(),
			email,
			password,
		});

		const organizationName = await getOrgName(response);
		return { status: "complete", ...toAuthResult(response), organizationName };
	} catch (error: unknown) {
		const orgSelection = isOrgSelectionRequired(error);
		if (orgSelection) {
			const orgResult = await resolveOrgAuth(email, orgSelection.pendingToken);
			if (orgResult) {
				return {
					status: "complete",
					...toAuthResult(orgResult.response),
					organizationName: orgResult.organizationName,
				};
			}
		}

		if (isOauthException(error)) {
			const token = getPendingToken(error);
			if (error.error === "mfa_enrollment") {
				return pendingResponse("mfa_required", token);
			}
			if (error.error === "email_verification_required") {
				return pendingResponse("verify_email", token);
			}
		}
		throw error;
	}
}

export const signIn = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/sign-in",
	},
	async (req: SignInRequest): Promise<SignInResponse> => {
		try {
			return await authenticateWithPassword(req.email, req.password);
		} catch (error: unknown) {
			handleWorkOSError(error, "Failed to sign in");
		}
	},
);
