import { useState } from "react";
import {
	Alert,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { useAuth } from "../providers/auth-provider";

interface LoginFormProps {
	onSuccess?: () => void;
	onSwitchToSignUp?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignUp }: LoginFormProps) {
	const { signIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		setIsLoading(true);
		try {
			const result = await signIn(email, password);
			if (result.status === "complete") {
				onSuccess?.();
			} else if (result.status === "verify_email") {
				Alert.alert("Verify Email", "Please verify your email before signing in.");
			}
		} catch (err) {
			Alert.alert(
				"Sign In Failed",
				err instanceof Error ? err.message : "Invalid email or password",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
				Welcome back
			</Text>
			<Text
				style={{
					fontSize: 14,
					color: "#6b7280",
					textAlign: "center",
					marginBottom: 8,
				}}
			>
				Sign in to your account
			</Text>

			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
				style={{
					borderWidth: 1,
					borderColor: "#e5e7eb",
					borderRadius: 8,
					padding: 12,
					fontSize: 16,
					backgroundColor: "#fff",
				}}
			/>

			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={{
					borderWidth: 1,
					borderColor: "#e5e7eb",
					borderRadius: 8,
					padding: 12,
					fontSize: 16,
					backgroundColor: "#fff",
				}}
			/>

			<Pressable
				onPress={handleSubmit}
				disabled={isLoading}
				style={{
					backgroundColor: isLoading ? "#93c5fd" : "#2563eb",
					borderRadius: 8,
					padding: 14,
					alignItems: "center",
				}}
			>
				<Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
					{isLoading ? "Signing in..." : "Sign In"}
				</Text>
			</Pressable>

			<Pressable onPress={onSwitchToSignUp}>
				<Text
					style={{ textAlign: "center", fontSize: 14, color: "#2563eb" }}
				>
					Don't have an account? Sign up
				</Text>
			</Pressable>
		</View>
	);
}
