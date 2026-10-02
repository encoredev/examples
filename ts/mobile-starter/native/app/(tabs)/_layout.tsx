import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function TabLayout() {
	return (
		<AuthGuard>
			<Tabs
				screenOptions={{
					headerStyle: { backgroundColor: "#fff" },
					headerTintColor: "#111827",
					tabBarActiveTintColor: "#2563eb",
					tabBarInactiveTintColor: "#9ca3af",
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Dashboard",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="grid-outline" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="members"
					options={{
						title: "Members",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="people-outline" size={size} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="person-outline" size={size} color={color} />
						),
					}}
				/>
			</Tabs>
		</AuthGuard>
	);
}
