import { useState } from "react";
import {
	Alert,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { useAuth } from "../providers/auth-provider";

interface SignUpFormProps {
	onSuccess?: () => void;
	onSwitchToLogin?: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps) {
	const { signUp } = useAuth();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!firstName || !lastName || !email || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}
		if (password.length < 8) {
			Alert.alert("Error", "Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);
		try {
			const result = await signUp(email, password, firstName, lastName);
			if (result.status === "complete") {
				onSuccess?.();
			} else if (result.status === "verify_email") {
				Alert.alert(
					"Verify Email",
					"Please check your inbox for a verification email.",
				);
			}
		} catch (err) {
			Alert.alert(
				"Sign Up Failed",
				err instanceof Error ? err.message : "Something went wrong",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const inputStyle = {
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#fff",
	} as const;

	return (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
				Create account
			</Text>
			<Text
				style={{
					fontSize: 14,
					color: "#6b7280",
					textAlign: "center",
					marginBottom: 8,
				}}
			>
				Get started with your new account
			</Text>

			<View style={{ flexDirection: "row", gap: 12 }}>
				<TextInput
					placeholder="First name"
					value={firstName}
					onChangeText={setFirstName}
					style={{ ...inputStyle, flex: 1 }}
				/>
				<TextInput
					placeholder="Last name"
					value={lastName}
					onChangeText={setLastName}
					style={{ ...inputStyle, flex: 1 }}
				/>
			</View>

			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
				style={inputStyle}
			/>

			<TextInput
				placeholder="Password (min 8 characters)"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={inputStyle}
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
					{isLoading ? "Creating account..." : "Create Account"}
				</Text>
			</Pressable>

			<Pressable onPress={onSwitchToLogin}>
				<Text
					style={{ textAlign: "center", fontSize: 14, color: "#2563eb" }}
				>
					Already have an account? Sign in
				</Text>
			</Pressable>
		</View>
	);
}
