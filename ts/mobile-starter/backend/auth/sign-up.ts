import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import log from "encore.dev/log";
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

interface SignUpRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

interface SignUpResponse {
	status: "complete" | "verify_email";
	accessToken?: string;
	refreshToken?: string;
	user?: UserInfo;
	userId?: string;
	pendingAuthenticationToken?: string;
	organizationName?: string;
}

async function createUser(req: SignUpRequest) {
	return getWorkOS().userManagement.createUser({
		email: req.email,
		password: req.password,
		firstName: req.firstName,
		lastName: req.lastName,
	});
}

function isEmailVerificationRequired(error: unknown): boolean {
	if (
		isOauthException(error) &&
		error.error === "email_verification_required"
	) {
		return true;
	}
	if (
		error instanceof Error &&
		"status" in error &&
		(error as Error & { status?: number }).status === 403 &&
		error.message.includes("verified before authentication")
	) {
		return true;
	}
	return false;
}

function extractPendingToken(error: unknown): string | undefined {
	if (isOauthException(error)) {
		return getPendingToken(error);
	}
	if (error instanceof Error && "rawData" in error) {
		const rawData = (error as Error & { rawData?: Record<string, unknown> })
			.rawData;
		return rawData?.pending_authentication_token as string | undefined;
	}
	return undefined;
}

async function authenticateNewUser(
	email: string,
	password: string,
	userId: string,
): Promise<SignUpResponse> {
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

		if (isEmailVerificationRequired(error)) {
			const pendingToken = extractPendingToken(error);
			log.info("signUp: email verification required", {
				userId,
				hasPendingToken: !!pendingToken,
			});
			return {
				status: "verify_email",
				userId,
				pendingAuthenticationToken: pendingToken,
			};
		}
		throw error;
	}
}

export const signUp = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/sign-up",
	},
	async (req: SignUpRequest): Promise<SignUpResponse> => {
		try {
			const user = await createUser(req);
			return await authenticateNewUser(req.email, req.password, user.id);
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				"status" in error &&
				(error as Error & { status?: number }).status === 409
			) {
				try {
					return await authenticateNewUser(req.email, req.password, "existing");
				} catch (authError: unknown) {
					handleWorkOSError(authError, "Failed to create account");
				}
			}

			handleWorkOSError(error, "Failed to create account");
		}
	},
);
