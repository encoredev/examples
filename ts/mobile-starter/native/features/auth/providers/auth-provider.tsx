import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { apiClient } from "@/lib/api/client";
import type { auth } from "@/lib/api/client.gen";
import { decodeJwtPayload, getRefreshDelay } from "@/lib/token-utils";
import { mapRole, type RoleType } from "@/lib/permissions";
import type { AuthContextType, AuthState } from "./types";

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
	isAuthenticated: false,
	isLoading: true,
	user: null,
	accessToken: null,
	role: "member",
	organizationId: "",
	organizationName: "",
};

function extractRoleAndOrg(token: string): {
	role: RoleType;
	organizationId: string;
} {
	const payload = decodeJwtPayload(token);
	if (!payload)
		return { role: "member", organizationId: "" };
	return {
		role: mapRole((payload.role as string) || undefined),
		organizationId: (payload.org_id as string) ?? "",
	};
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AuthState>(initialState);
	const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	const updateAuth = useCallback(
		async (result: auth.RefreshResponse & { organizationName?: string }) => {
			await SecureStore.setItemAsync("accessToken", result.accessToken);
			await SecureStore.setItemAsync("refreshToken", result.refreshToken);
			if (result.organizationName) {
				await SecureStore.setItemAsync(
					"organizationName",
					result.organizationName,
				);
			}

			const { role, organizationId } = extractRoleAndOrg(result.accessToken);
			const orgName =
				result.organizationName ??
				(await SecureStore.getItemAsync("organizationName")) ??
				organizationId;

			setState({
				isAuthenticated: true,
				isLoading: false,
				user: result.user,
				accessToken: result.accessToken,
				role,
				organizationId,
				organizationName: orgName,
			});

			// Schedule refresh
			if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
			const delay = getRefreshDelay(result.accessToken);
			refreshTimerRef.current = setTimeout(async () => {
				try {
					const refreshToken = await SecureStore.getItemAsync("refreshToken");
					if (!refreshToken) return;
					const refreshResult = await apiClient.auth.refresh({ refreshToken });
					await updateAuth(refreshResult);
				} catch {
					await clearAuth();
				}
			}, delay);
		},
		[],
	);

	const clearAuth = useCallback(async () => {
		await SecureStore.deleteItemAsync("accessToken");
		await SecureStore.deleteItemAsync("refreshToken");
		await SecureStore.deleteItemAsync("organizationName");
		if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
		setState({ ...initialState, isLoading: false });
	}, []);

	// Bootstrap: try to restore session from SecureStore
	useEffect(() => {
		const bootstrap = async () => {
			const refreshToken = await SecureStore.getItemAsync("refreshToken");
			if (!refreshToken) {
				setState((prev) => ({ ...prev, isLoading: false }));
				return;
			}

			try {
				const result = await apiClient.auth.refresh({ refreshToken });
				await updateAuth(result);
			} catch {
				await SecureStore.deleteItemAsync("refreshToken");
				setState((prev) => ({ ...prev, isLoading: false }));
			}
		};

		bootstrap();

		return () => {
			if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
		};
	}, [updateAuth]);

	const signIn = useCallback(
		async (email: string, password: string) => {
			const result = await apiClient.auth.signIn({ email, password });
			if (
				result.status === "complete" &&
				result.accessToken &&
				result.refreshToken &&
				result.user
			) {
				await updateAuth({
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
					user: result.user,
					organizationName: result.organizationName,
				});
			}
			return result;
		},
		[updateAuth],
	);

	const signUp = useCallback(
		async (
			email: string,
			password: string,
			firstName: string,
			lastName: string,
		) => {
			const result = await apiClient.auth.signUp({
				email,
				password,
				firstName,
				lastName,
			});
			if (
				result.status === "complete" &&
				result.accessToken &&
				result.refreshToken &&
				result.user
			) {
				await updateAuth({
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
					user: result.user,
					organizationName: result.organizationName,
				});
			}
			return result;
		},
		[updateAuth],
	);

	const signOut = useCallback(async () => {
		apiClient.auth.signOut({}).catch(() => {});
		await clearAuth();
	}, [clearAuth]);

	const value = useMemo<AuthContextType>(
		() => ({
			...state,
			signIn,
			signUp,
			signOut,
			storeSession: updateAuth,
		}),
		[state, signIn, signUp, signOut, updateAuth],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
