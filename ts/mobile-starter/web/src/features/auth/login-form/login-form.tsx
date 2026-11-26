import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "../oauth-buttons/oauth-buttons";
import { useLoginForm } from "./login-form.hooks";
import type { LoginFormProps } from "./login-form.types";

export function LoginForm(props: LoginFormProps) {
	const {
		form,
		showPassword,
		togglePassword,
		isLoading,
		generalError,
		handleSubmit,
	} = useLoginForm(props);

	const {
		register,
		formState: { errors },
	} = form;

	return (
		<div>
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold text-text">Welcome back</h1>
				<p className="mt-1 text-sm text-text-secondary">
					Sign in to your account
				</p>
			</div>

			<Card>
				<OAuthButtons label="sign_in" />

				{generalError && (
					<div
						role="alert"
						className="mb-4 rounded-lg border border-error/30 bg-error-muted p-3 text-sm text-error"
					>
						{generalError}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							{...register("email")}
							className="mt-1"
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-error">{errors.email.message}</p>
						)}
					</div>

					<div>
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
							<Link
								to="/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>
						<div className="relative mt-1">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								{...register("password")}
							/>
							<button
								type="button"
								onClick={togglePassword}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-error">
								{errors.password.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full"
					>
						{isLoading ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</Card>

			<p className="mt-4 text-center text-sm text-text-secondary">
				Don't have an account?{" "}
				<Link to="/signup" className="text-primary hover:underline">
					Sign up
				</Link>
			</p>
		</div>
	);
}
