import type { AuthenticationResponse, User } from "@workos-inc/node";
import { APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { hasPermission, mapRole, type Permission } from "./permissions";

export interface UserInfo {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	profilePictureUrl: string | null;
}

export function toUserInfo(user: User): UserInfo {
	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		profilePictureUrl: user.profilePictureUrl,
	};
}

export function toAuthResult(response: AuthenticationResponse) {
	return {
		accessToken: response.accessToken,
		refreshToken: response.refreshToken,
		user: toUserInfo(response.user),
	};
}

interface OauthError extends Error {
	name: "OauthException";
	error?: string;
	rawData?: Record<string, unknown>;
}

export function isOauthException(error: unknown): error is OauthError {
	return error instanceof Error && error.name === "OauthException";
}

export function getPendingToken(error: OauthError): string | undefined {
	return error.rawData?.pending_authentication_token as string | undefined;
}

export function handleWorkOSError(
	error: unknown,
	fallbackMessage: string,
): never {
	if (error instanceof APIError) {
		throw error;
	}

	if (error instanceof Error && "status" in error) {
		const status = (error as Error & { status?: number }).status;

		if (status === 401) {
			throw APIError.unauthenticated("Invalid email or password");
		}
		if (status === 409) {
			throw APIError.alreadyExists("A user with this email already exists");
		}
		if (status === 422) {
			throw APIError.invalidArgument(error.message);
		}
		if (status === 429) {
			throw APIError.resourceExhausted("Too many requests");
		}
	}

	throw APIError.internal(fallbackMessage);
}

export function requirePermission(permission: Permission): void {
	const authData = getAuthData();
	if (!authData) {
		throw APIError.unauthenticated("Not authenticated");
	}

	const role = mapRole(authData.role);
	if (!hasPermission(role, permission)) {
		throw APIError.permissionDenied(`Missing permission: ${permission}`);
	}
}
