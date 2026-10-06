import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/features/auth/auth-layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPassword,
});

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await apiClient.auth.forgotPassword({
				email,
				passwordResetUrl: `${window.location.origin}/reset-password`,
			});
			setSent(true);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold text-text">Reset your password</h1>
				<p className="mt-1 text-sm text-text-secondary">
					Enter your email and we'll send you a reset link
				</p>
			</div>

			<Card>
				{sent ? (
					<div className="text-center">
						<p className="text-sm text-text-secondary">
							If an account with that email exists, we sent a password reset
							link. Check your inbox.
						</p>
						<Link
							to="/login"
							className="mt-4 inline-block text-sm text-primary hover:underline"
						>
							Back to login
						</Link>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="mt-1"
							/>
						</div>
						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? "Sending..." : "Send Reset Link"}
						</Button>
						<div className="text-center">
							<Link
								to="/login"
								className="text-sm text-primary hover:underline"
							>
								Back to login
							</Link>
						</div>
					</form>
				)}
			</Card>
		</AuthLayout>
	);
}
