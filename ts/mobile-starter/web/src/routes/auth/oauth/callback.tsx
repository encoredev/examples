import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/lib/auth-provider";
import { apiClient } from "@/lib/api/client";

export const Route = createFileRoute("/auth/oauth/callback")({
	validateSearch: (search: Record<string, unknown>) => ({
		code: (search.code as string) ?? "",
	}),
	component: OAuthCallback,
});

function OAuthCallback() {
	const { code } = Route.useSearch();
	const { storeSession } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState("");

	useEffect(() => {
		if (!code) {
			setError("No authorization code received");
			return;
		}

		apiClient.auth
			.oauthCallback({ code })
			.then((result) => {
				storeSession(result);
				navigate({ to: "/_app/dashboard" });
			})
			.catch((err) => {
				setError(
					err instanceof Error ? err.message : "OAuth authentication failed",
				);
			});
	}, [code, storeSession, navigate]);

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<p className="text-error">{error}</p>
					<a href="/login" className="mt-2 text-sm text-primary hover:underline">
						Back to login
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<p className="text-text-secondary">Completing sign in...</p>
		</div>
	);
}
