import "@/global.css";

import { Stack } from "expo-router";
import { AuthProvider } from "@/features/auth/providers/auth-provider";

export const unstable_settings = {
	initialRouteName: "index",
};

export default function Layout() {
	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="(tabs)" />
			</Stack>
		</AuthProvider>
	);
}
