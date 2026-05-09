import { useCallback, useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { apiClient } from "@/lib/api/client";
import { hasPermission, P } from "@/lib/permissions";
import type { auth } from "@/lib/api/client.gen";

export default function MembersScreen() {
	const { role } = useAuth();
	const canInvite = hasPermission(role, P.MEMBERS_INVITE);
	const canRemove = hasPermission(role, P.MEMBERS_REMOVE);

	const [invitations, setInvitations] = useState<auth.InvitationItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
	const [isSending, setIsSending] = useState(false);

	const loadInvitations = useCallback(async () => {
		try {
			const result = await apiClient.auth.listInvitations();
			setInvitations(result.invitations);
		} catch {
			// Error handled silently
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadInvitations();
	}, [loadInvitations]);

	const handleInvite = async () => {
		if (!inviteEmail) {
			Alert.alert("Error", "Please enter an email address");
			return;
		}

		setIsSending(true);
		try {
			await apiClient.auth.sendInvitation({
				email: inviteEmail,
				role: inviteRole,
			});
			setInviteEmail("");
			Alert.alert("Success", `Invitation sent to ${inviteEmail}`);
			loadInvitations();
		} catch (err) {
			Alert.alert(
				"Error",
				err instanceof Error ? err.message : "Failed to send invitation",
			);
		} finally {
			setIsSending(false);
		}
	};

	const handleRevoke = async (id: string) => {
		Alert.alert("Revoke Invitation", "Are you sure?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Revoke",
				style: "destructive",
				onPress: async () => {
					try {
						await apiClient.auth.revokeInvitation({ id });
						loadInvitations();
					} catch {
						Alert.alert("Error", "Failed to revoke invitation");
					}
				},
			},
		]);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }} edges={["bottom"]}>
			<View style={{ padding: 20, gap: 16, flex: 1 }}>
				<Text style={{ fontSize: 24, fontWeight: "bold" }}>Members</Text>

				{canInvite && (
					<View
						style={{
							backgroundColor: "#fff",
							borderRadius: 12,
							padding: 16,
							borderWidth: 1,
							borderColor: "#e5e7eb",
							gap: 12,
						}}
					>
						<Text style={{ fontSize: 16, fontWeight: "600" }}>
							Invite a member
						</Text>
						<TextInput
							placeholder="colleague@example.com"
							value={inviteEmail}
							onChangeText={setInviteEmail}
							autoCapitalize="none"
							keyboardType="email-address"
							style={{
								borderWidth: 1,
								borderColor: "#e5e7eb",
								borderRadius: 8,
								padding: 12,
								fontSize: 16,
								backgroundColor: "#f9fafb",
							}}
						/>
						<View style={{ flexDirection: "row", gap: 8 }}>
							<Pressable
								onPress={() => setInviteRole("member")}
								style={{
									flex: 1,
									padding: 10,
									borderRadius: 8,
									borderWidth: 1,
									borderColor:
										inviteRole === "member" ? "#2563eb" : "#e5e7eb",
									backgroundColor:
										inviteRole === "member" ? "#eff6ff" : "#fff",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color:
											inviteRole === "member" ? "#2563eb" : "#6b7280",
										fontWeight: "500",
									}}
								>
									Member
								</Text>
							</Pressable>
							<Pressable
								onPress={() => setInviteRole("admin")}
								style={{
									flex: 1,
									padding: 10,
									borderRadius: 8,
									borderWidth: 1,
									borderColor:
										inviteRole === "admin" ? "#2563eb" : "#e5e7eb",
									backgroundColor:
										inviteRole === "admin" ? "#eff6ff" : "#fff",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										color:
											inviteRole === "admin" ? "#2563eb" : "#6b7280",
										fontWeight: "500",
									}}
								>
									Admin
								</Text>
							</Pressable>
						</View>
						<Pressable
							onPress={handleInvite}
							disabled={isSending}
							style={{
								backgroundColor: isSending ? "#93c5fd" : "#2563eb",
								borderRadius: 8,
								padding: 12,
								alignItems: "center",
							}}
						>
							<Text style={{ color: "#fff", fontWeight: "600" }}>
								{isSending ? "Sending..." : "Send Invitation"}
							</Text>
						</Pressable>
					</View>
				)}

				<Text style={{ fontSize: 16, fontWeight: "600" }}>
					Pending Invitations
				</Text>

				{isLoading ? (
					<Text style={{ color: "#6b7280" }}>Loading...</Text>
				) : invitations.length === 0 ? (
					<Text style={{ color: "#6b7280" }}>No pending invitations.</Text>
				) : (
					<FlatList
						data={invitations}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View
								style={{
									backgroundColor: "#fff",
									borderRadius: 8,
									padding: 14,
									borderWidth: 1,
									borderColor: "#e5e7eb",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 8,
								}}
							>
								<View>
									<Text style={{ fontWeight: "500" }}>{item.email}</Text>
									<Text style={{ fontSize: 12, color: "#6b7280" }}>
										{item.status}
									</Text>
								</View>
								{canRemove && (
									<Pressable onPress={() => handleRevoke(item.id)}>
										<Text style={{ color: "#ef4444", fontSize: 14 }}>
											Revoke
										</Text>
									</Pressable>
								)}
							</View>
						)}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}
