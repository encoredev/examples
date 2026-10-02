import Client, { Local } from "./client.gen";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? Local;

export const apiClient = new Client(API_BASE_URL, {
	auth: async () => {
		const token = await SecureStore.getItemAsync("accessToken");
		if (token) return { authorization: `Bearer ${token}` };
		return undefined;
	},
});
