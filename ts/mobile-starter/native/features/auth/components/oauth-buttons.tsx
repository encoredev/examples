import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "../providers/auth-provider";
import type { auth } from "@/lib/api/client.gen";

export function OAuthButtons() {
	const { storeSession } = useAuth();
	const [loadingProvider, setLoadingProvider] =
		useState<auth.OAuthProvider | null>(null);

	const handleOAuth = async (provider: auth.OAuthProvider) => {
		setLoadingProvider(provider);
		try {
			const redirectUri = Linking.createURL("auth/callback");
			const { url } = await apiClient.auth.getOAuthUrl({
				provider,
				redirectUri,
			});

			const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);

			if (result.type === "success" && result.url) {
				const parsed = Linking.parse(result.url);
				const code = parsed.queryParams?.code as string | undefined;
				if (code) {
					const authResult = await apiClient.auth.oauthCallback({ code });
					await storeSession(authResult);
				}
			}
		} catch {
			// User cancelled or error occurred
		} finally {
			setLoadingProvider(null);
		}
	};

	const buttonStyle = {
		flexDirection: "row" as const,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		gap: 8,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#fff",
	};

	return (
		<View style={{ gap: 12, marginBottom: 16 }}>
			<Pressable
				onPress={() => handleOAuth("GoogleOAuth")}
				disabled={loadingProvider !== null}
				style={buttonStyle}
			>
				<Text style={{ fontSize: 16, fontWeight: "500" }}>
					{loadingProvider === "GoogleOAuth"
						? "Redirecting..."
						: "Continue with Google"}
				</Text>
			</Pressable>

			<Pressable
				onPress={() => handleOAuth("MicrosoftOAuth")}
				disabled={loadingProvider !== null}
				style={buttonStyle}
			>
				<Text style={{ fontSize: 16, fontWeight: "500" }}>
					{loadingProvider === "MicrosoftOAuth"
						? "Redirecting..."
						: "Continue with Microsoft"}
				</Text>
			</Pressable>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginVertical: 8,
				}}
			>
				<View
					style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }}
				/>
				<Text style={{ marginHorizontal: 12, color: "#9ca3af", fontSize: 14 }}>
					or
				</Text>
				<View
					style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }}
				/>
			</View>
		</View>
	);
}
