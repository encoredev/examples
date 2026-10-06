import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { apiClient, setAccessToken } from "@/lib/api/client";
import type { auth } from "@/lib/api/client.gen";

export interface AuthContextValue {
	user: auth.UserInfo | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	accessToken: string | null;
	signIn: (email: string, password: string) => Promise<auth.SignInResponse>;
	signUp: (
		email: string,
		password: string,
		firstName: string,
		lastName: string,
	) => Promise<auth.SignUpResponse>;
	signOut: () => void;
	getAccessToken: () => string | null;
	storeSession: (result: auth.RefreshResponse) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): Record<string, unknown> {
	const base64 = token.split(".")[1];
	const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
	return JSON.parse(json);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<auth.UserInfo | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	function updateAuth(
		result: auth.RefreshResponse & { organizationName?: string },
	) {
		setUser(result.user);
		setToken(result.accessToken);
		setAccessToken(result.accessToken);
		localStorage.setItem("refreshToken", result.refreshToken);
		if (result.organizationName) {
			localStorage.setItem("organizationName", result.organizationName);
		}
		scheduleRefresh(result.accessToken, result.refreshToken);
	}

	function clearAuth() {
		setUser(null);
		setToken(null);
		setAccessToken(null);
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("organizationName");
		if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
	}

	function scheduleRefresh(accessToken: string, refreshToken: string) {
		if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
		try {
			const payload = decodeJwtPayload(accessToken);
			const exp = (payload.exp as number) * 1000;
			const delay = Math.max(0, exp - Date.now() - 60_000);
			refreshTimerRef.current = setTimeout(async () => {
				try {
					const result = await apiClient.auth.refresh({ refreshToken });
					updateAuth(result);
				} catch {
					clearAuth();
				}
			}, delay);
		} catch {
			/* invalid token */
		}
	}

	useEffect(() => {
		const stored = localStorage.getItem("refreshToken");
		if (!stored) {
			setIsLoading(false);
			return;
		}
		apiClient.auth
			.refresh({ refreshToken: stored })
			.then((result) => updateAuth(result))
			.catch(() => localStorage.removeItem("refreshToken"))
			.finally(() => setIsLoading(false));
		return () => {
			if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
		};
	}, []);

	function storeIfComplete(result: {
		status: string;
		accessToken?: string;
		refreshToken?: string;
		user?: auth.UserInfo;
		organizationName?: string;
	}) {
		if (
			result.status === "complete" &&
			result.accessToken &&
			result.refreshToken &&
			result.user
		) {
			updateAuth({
				accessToken: result.accessToken,
				refreshToken: result.refreshToken,
				user: result.user,
				organizationName: result.organizationName,
			});
		}
	}

	const handleSignIn = async (email: string, password: string) => {
		const result = await apiClient.auth.signIn({ email, password });
		storeIfComplete(result);
		return result;
	};

	const handleSignUp = async (
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
		storeIfComplete(result);
		return result;
	};

	const handleSignOut = () => {
		apiClient.auth.signOut({}).catch(() => {});
		clearAuth();
		window.location.href = "/";
	};

	const value = useMemo<AuthContextValue>(
		() => ({
			user,
			isLoading,
			isAuthenticated: !!user,
			accessToken: token,
			signIn: handleSignIn,
			signUp: handleSignUp,
			signOut: handleSignOut,
			getAccessToken: () => token,
			storeSession: updateAuth,
		}),
		[user, isLoading, token],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
