import type { AuthenticationResponse } from "@workos-inc/node";
import { secret } from "encore.dev/config";
import log from "encore.dev/log";
import { getWorkOS } from "./auth";
import { getPendingToken, isOauthException } from "./auth.helpers";

const workOSClientId = secret("WorkOSClientId");

type OrgAuthResult = {
	response: AuthenticationResponse;
	organizationName: string;
};

async function selectFirstOrg(
	userId: string,
	pendingToken: string,
): Promise<OrgAuthResult | null> {
	const workos = getWorkOS();
	const memberships = await workos.userManagement.listOrganizationMemberships({
		userId,
		statuses: ["active"],
	});

	if (memberships.data.length === 0) {
		log.info("resolveOrgAuth: no active memberships", { userId });
		return null;
	}

	if (memberships.data.length > 1) {
		log.info(
			"resolveOrgAuth: multiple memberships, deferring to org selection",
			{ userId, count: memberships.data.length },
		);
		return null;
	}

	const membership = memberships.data[0];
	log.info("resolveOrgAuth: selecting org", {
		userId,
		organizationId: membership.organizationId,
		role: membership.role?.slug,
	});

	const response =
		await workos.userManagement.authenticateWithOrganizationSelection({
			clientId: workOSClientId(),
			organizationId: membership.organizationId,
			pendingAuthenticationToken: pendingToken,
		});
	return { response, organizationName: membership.organizationName };
}

export async function resolveOrgAuth(
	email: string,
	pendingToken: string,
): Promise<OrgAuthResult | null> {
	const users = await getWorkOS().userManagement.listUsers({ email });
	const user = users.data[0];
	if (!user) {
		log.warn("resolveOrgAuth: user not found by email", { email });
		return null;
	}
	return selectFirstOrg(user.id, pendingToken);
}

export async function resolveOrgAuthByUserId(
	userId: string,
	pendingToken: string,
): Promise<OrgAuthResult | null> {
	return selectFirstOrg(userId, pendingToken);
}

export async function getOrgName(
	response: AuthenticationResponse,
): Promise<string | undefined> {
	if (!response.organizationId) return undefined;
	try {
		const org = await getWorkOS().organizations.getOrganization(
			response.organizationId,
		);
		return org.name;
	} catch {
		return undefined;
	}
}

export function isOrgSelectionRequired(
	error: unknown,
): { pendingToken: string; userId?: string } | null {
	if (!isOauthException(error)) return null;
	if (error.error !== "organization_selection_required") return null;
	const token = getPendingToken(error);
	if (!token) return null;
	const userId = (error.rawData?.user as Record<string, unknown>)?.id as
		| string
		| undefined;
	return { pendingToken: token, userId };
}
