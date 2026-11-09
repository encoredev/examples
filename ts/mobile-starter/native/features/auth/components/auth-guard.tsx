import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../providers/auth-provider";

interface AuthGuardProps {
	children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (isLoading) return;
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated, isLoading]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" color="#2563eb" />
			</View>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
