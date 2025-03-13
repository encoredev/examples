import { verifyToken } from "@clerk/backend";
import { APIError, Gateway, type Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

// This secret is defined in Encore.
// See https://encore.dev/docs/ts/primitives/secrets for more information.
const clerkSecretKey = secret("ClerkSecretKey");

// AuthParams specifies the incoming request information
// the auth handler is interested in. In this case it only
// cares about requests that contain the `Authorization` header.
interface AuthParams {
	authorization: Header<"Authorization">;
}

// The AuthData specifies the information about the authenticated user
// that the auth handler makes available.
interface AuthData {
	// This user id is the clerk user id.
	// More information about the user can be fetched with the clerk client.
	userID: string;
	// This org id is the clerk organization id.
	// More information about the organization can be fetched with the clerk client.
	orgID: string;
}

// The auth handler itself.
export const auth = authHandler<AuthParams, AuthData>(async (params) => {
	try {
		const token = params.authorization.replace("Bearer ", "");

		// See https://clerk.com/docs/references/backend/verify-token for more information about the `verifyToken` function.
		const verifiedToken = await verifyToken(token, {
			secretKey: clerkSecretKey(),
		});

		return {
			userID: verifiedToken.sub,
			orgID: verifiedToken.org_id ?? "",
		};
	} catch (error) {
		throw APIError.unauthenticated("could not verify token");
	}
});

// Define the API Gateway that will execute the auth handler:
export const gateway = new Gateway({
	authHandler: auth,
});
