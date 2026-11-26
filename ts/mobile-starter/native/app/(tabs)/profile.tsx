import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/providers/auth-provider";

export default function ProfileScreen() {
	const { user, role, organizationName, signOut } = useAuth();

	const name =
		`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
		user?.email ||
		"User";

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }} edges={["bottom"]}>
			<ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
				<Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>

				<View
					style={{
						backgroundColor: "#fff",
						borderRadius: 12,
						padding: 16,
						borderWidth: 1,
						borderColor: "#e5e7eb",
						gap: 16,
					}}
				>
					<ProfileRow label="Name" value={name} />
					<ProfileRow label="Email" value={user?.email || "N/A"} />
					<ProfileRow label="Role" value={role} capitalize />
					<ProfileRow
						label="Organization"
						value={organizationName || "N/A"}
					/>
					<ProfileRow
						label="User ID"
						value={user?.id || "N/A"}
						mono
					/>
				</View>

				<Pressable
					onPress={signOut}
					style={{
						backgroundColor: "#ef4444",
						borderRadius: 8,
						padding: 14,
						alignItems: "center",
						marginTop: 16,
					}}
				>
					<Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
						Sign Out
					</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
}

function ProfileRow({
	label,
	value,
	capitalize,
	mono,
}: {
	label: string;
	value: string;
	capitalize?: boolean;
	mono?: boolean;
}) {
	return (
		<View>
			<Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>
				{label}
			</Text>
			<Text
				style={{
					fontSize: mono ? 12 : 16,
					fontWeight: "500",
					textTransform: capitalize ? "capitalize" : "none",
					fontFamily: mono ? "monospace" : undefined,
				}}
			>
				{value}
			</Text>
		</View>
	);
}
