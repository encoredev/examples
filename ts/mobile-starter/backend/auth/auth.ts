import { WorkOS } from "@workos-inc/node";
import { APIError, Gateway, type Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

const workOSClientId = secret("WorkOSClientId");
const workOSApiKey = secret("WorkOSApiKey");

let _workos: WorkOS | undefined;
export const getWorkOS = () => {
	if (!_workos) {
		_workos = new WorkOS(workOSApiKey());
	}
	return _workos;
};

const getJWKS = () =>
	createRemoteJWKSet(
		new URL(`https://api.workos.com/sso/jwks/${workOSClientId()}`),
	);

interface AuthParams {
	authorization: Header<"Authorization">;
}

export interface AuthData {
	userID: string;
	email: string;
	role: "admin" | "member";
	organizationId: string;
}

export const auth = authHandler<AuthParams, AuthData>(async (params) => {
	const token = params.authorization.replace("Bearer ", "");
	if (!token) {
		throw APIError.unauthenticated("missing authorization token");
	}

	try {
		const { payload } = await jwtVerify(token, getJWKS());

		return {
			userID: payload.sub ?? "",
			email: (payload.email as string) ?? "",
			role: ((payload.role as string) ?? "member") as "admin" | "member",
			organizationId: (payload.org_id as string) ?? "",
		};
	} catch {
		throw APIError.unauthenticated("could not verify token");
	}
});

export const gateway = new Gateway({
	authHandler: auth,
});
