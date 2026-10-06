import Client, { Local } from "./client.gen";

const baseUrl = import.meta.env.VITE_API_URL || Local;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
	accessToken = token;
}

export const apiClient = new Client(baseUrl, {
	auth: () => {
		if (accessToken) return { authorization: `Bearer ${accessToken}` };
		return undefined;
	},
});
