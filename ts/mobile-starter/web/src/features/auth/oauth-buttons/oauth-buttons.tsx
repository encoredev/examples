import { useState } from "react";
import { apiClient } from "@/lib/api/client";
import type { auth } from "@/lib/api/client.gen";

function GoogleIcon() {
	return (
		<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}

function MicrosoftIcon() {
	return (
		<svg viewBox="0 0 21 21" className="h-5 w-5" aria-hidden="true">
			<rect x="1" y="1" width="9" height="9" fill="#F25022" />
			<rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
			<rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
			<rect x="11" y="11" width="9" height="9" fill="#FFB900" />
		</svg>
	);
}

interface OAuthButtonsProps {
	label?: "sign_in" | "sign_up";
}

export function OAuthButtons({ label = "sign_in" }: OAuthButtonsProps) {
	const [loadingProvider, setLoadingProvider] =
		useState<auth.OAuthProvider | null>(null);

	const handleOAuth = async (provider: auth.OAuthProvider) => {
		setLoadingProvider(provider);
		try {
			const redirectUri = `${window.location.origin}/auth/oauth/callback`;
			const result = await apiClient.auth.getOAuthUrl({
				provider,
				redirectUri,
			});
			window.location.href = result.url;
		} catch {
			setLoadingProvider(null);
		}
	};

	const verb = label === "sign_up" ? "Sign up" : "Continue";

	return (
		<div className="space-y-3 mb-6">
			<button
				type="button"
				disabled={loadingProvider !== null}
				onClick={() => handleOAuth("GoogleOAuth")}
				className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
			>
				<GoogleIcon />
				{loadingProvider === "GoogleOAuth"
					? "Redirecting..."
					: `${verb} with Google`}
			</button>

			<button
				type="button"
				disabled={loadingProvider !== null}
				onClick={() => handleOAuth("MicrosoftOAuth")}
				className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
			>
				<MicrosoftIcon />
				{loadingProvider === "MicrosoftOAuth"
					? "Redirecting..."
					: `${verb} with Microsoft`}
			</button>

			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-surface-elevated px-4 text-text-secondary">
						or continue with email
					</span>
				</div>
			</div>
		</div>
	);
}
