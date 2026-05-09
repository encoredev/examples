import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getWorkOS } from "./auth";
import { handleWorkOSError, toAuthResult, type UserInfo } from "./auth.helpers";
import { getOrgName } from "./org-auth";

const workOSClientId = secret("WorkOSClientId");

interface RefreshRequest {
	refreshToken: string;
}

interface RefreshResponse {
	accessToken: string;
	refreshToken: string;
	user: UserInfo;
	organizationName?: string;
}

export const refresh = api(
	{
		expose: true,
		auth: false,
		method: "POST",
		path: "/api/auth/refresh",
	},
	async (req: RefreshRequest): Promise<RefreshResponse> => {
		try {
			const response =
				await getWorkOS().userManagement.authenticateWithRefreshToken({
					clientId: workOSClientId(),
					refreshToken: req.refreshToken,
				});

			const organizationName = await getOrgName(response);
			return { ...toAuthResult(response), organizationName };
		} catch (error: unknown) {
			handleWorkOSError(error, "Failed to refresh token");
		}
	},
);
