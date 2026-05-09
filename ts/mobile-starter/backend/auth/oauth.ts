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

type OAuthProvider = "GoogleOAuth" | "MicrosoftOAuth";

interface OAuthUrlRequest {
	provider: OAuthProvider;
	redirectUri: string;
}

interface OAuthUrlResponse {
	url: string;
}

export const getOAuthUrl = api(
	{
		expose: true,
		auth: false,
		method: "GET",
		path: "/api/auth/oauth/url",
	},
	async (req: OAuthUrlRequest): Promise<OAuthUrlResponse> => {
		try {
			const url = await getWorkOS().userManagement.getAuthorizationUrl({
				provider: req.provider,
				clientId: workOSClientId(),
				redirectUri: req.redirectUri,
			});

			return { url };
		} catch (error: unknown) {
			handleWorkOSError(error, "Failed to get OAuth URL");
		}
	},
);

interface OAuthCallbackRequest {
	code: string;
}

interface OAuthCallbackResponse {
	accessToken: string;
	refreshToken: string;
	user: UserInfo;
	organizationName?: string;
}

export const oauthCallback = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/oauth/callback",
	},
	async (req: OAuthCallbackRequest): Promise<OAuthCallbackResponse> => {
		try {
			const response = await getWorkOS().userManagement.authenticateWithCode({
				clientId: workOSClientId(),
				code: req.code,
			});

			const organizationName = await getOrgName(response);
			return { ...toAuthResult(response), organizationName };
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

			handleWorkOSError(error, "Failed to authenticate with OAuth");
		}
	},
);
