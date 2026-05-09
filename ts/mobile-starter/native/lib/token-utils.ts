export function decodeJwtPayload(
	token: string,
): Record<string, unknown> | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = JSON.parse(atob(parts[1]));
		return payload;
	} catch {
		return null;
	}
}

export function isTokenExpiringSoon(
	token: string,
	bufferSeconds = 60,
): boolean {
	const payload = decodeJwtPayload(token);
	if (!payload?.exp) return true;

	const nowSeconds = Math.floor(Date.now() / 1000);
	return (payload.exp as number) - nowSeconds <= bufferSeconds;
}

export function getTokenExpiryMs(token: string): number {
	const payload = decodeJwtPayload(token);
	if (!payload?.exp) return 0;
	return (payload.exp as number) * 1000;
}

export function getRefreshDelay(accessToken: string): number {
	const expiryMs = getTokenExpiryMs(accessToken);
	return Math.max(0, expiryMs - Date.now() - 60_000);
}
