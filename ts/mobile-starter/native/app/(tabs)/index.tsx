import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/providers/auth-provider";

export default function DashboardScreen() {
	const { user, role, organizationName, email } = useAuth();

	const name =
		`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
		email ||
		"User";

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }} edges={["bottom"]}>
			<ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
				<Text style={{ fontSize: 24, fontWeight: "bold" }}>Dashboard</Text>
				<Text style={{ fontSize: 14, color: "#6b7280" }}>
					Welcome back, {name}
				</Text>

				<InfoCard title="Role" value={role} />
				<InfoCard title="Organization" value={organizationName || "N/A"} />
				<InfoCard title="Email" value={user?.email || "N/A"} />
			</ScrollView>
		</SafeAreaView>
	);
}

function InfoCard({ title, value }: { title: string; value: string }) {
	return (
		<View
			style={{
				backgroundColor: "#fff",
				borderRadius: 12,
				padding: 16,
				borderWidth: 1,
				borderColor: "#e5e7eb",
			}}
		>
			<Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
				{title}
			</Text>
			<Text style={{ fontSize: 16, fontWeight: "600", textTransform: "capitalize" }}>
				{value}
			</Text>
		</View>
	);
}
