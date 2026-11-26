import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/features/auth/auth-layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";

export const Route = createFileRoute("/reset-password")({
	validateSearch: (search: Record<string, unknown>) => ({
		token: (search.token as string) ?? "",
	}),
	component: ResetPassword,
});

function ResetPassword() {
	const { token } = useSearch({ from: "/reset-password" });
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await apiClient.auth.resetPassword({ token, newPassword });
			setSuccess(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to reset password",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold text-text">Set new password</h1>
				<p className="mt-1 text-sm text-text-secondary">
					Enter your new password below
				</p>
			</div>

			<Card>
				{success ? (
					<div className="text-center">
						<p className="text-sm text-text-secondary">
							Your password has been reset successfully.
						</p>
						<Link
							to="/login"
							className="mt-4 inline-block text-sm text-primary hover:underline"
						>
							Sign in with your new password
						</Link>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="rounded-lg border border-error/30 bg-error-muted p-3 text-sm text-error">
								{error}
							</div>
						)}
						<div>
							<Label htmlFor="newPassword">New password</Label>
							<Input
								id="newPassword"
								type="password"
								placeholder="At least 8 characters"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="confirmPassword">Confirm password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Re-enter your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="mt-1"
							/>
						</div>
						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? "Resetting..." : "Reset Password"}
						</Button>
					</form>
				)}
			</Card>
		</AuthLayout>
	);
}
