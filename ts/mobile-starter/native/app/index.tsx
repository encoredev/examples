import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignUpForm } from "@/features/auth/components/signup-form";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";

export default function LandingScreen() {
	const { isAuthenticated, isLoading } = useAuth();
	const [mode, setMode] = useState<"login" | "signup">("login");

	useEffect(() => {
		if (isLoading) return;
		if (isAuthenticated) {
			router.replace("/(tabs)");
		}
	}, [isAuthenticated, isLoading]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text style={{ color: "#6b7280" }}>Loading...</Text>
			</View>
		);
	}

	const handleSuccess = () => {
		router.replace("/(tabs)");
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
						paddingHorizontal: 24,
						paddingVertical: 32,
					}}
					keyboardShouldPersistTaps="handled"
				>
					<OAuthButtons />

					{mode === "login" ? (
						<LoginForm
							onSuccess={handleSuccess}
							onSwitchToSignUp={() => setMode("signup")}
						/>
					) : (
						<SignUpForm
							onSuccess={handleSuccess}
							onSwitchToLogin={() => setMode("login")}
						/>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
