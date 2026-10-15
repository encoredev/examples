import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Not Found" }} />
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
				<Text style={{ fontSize: 20, fontWeight: "bold" }}>
					This screen doesn't exist.
				</Text>
				<Link href="/" style={{ marginTop: 16, paddingVertical: 16 }}>
					<Text style={{ color: "#2563eb" }}>Go to home screen</Text>
				</Link>
			</View>
		</>
	);
}
