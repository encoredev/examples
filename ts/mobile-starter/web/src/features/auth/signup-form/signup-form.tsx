import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "../oauth-buttons/oauth-buttons";
import { useSignUpForm } from "./signup-form.hooks";
import type { SignUpFormProps } from "./signup-form.types";

export function SignUpForm(props: SignUpFormProps) {
	const {
		form,
		step,
		showPassword,
		togglePassword,
		showConfirmPassword,
		toggleConfirmPassword,
		isLoading,
		generalError,
		emailAddress,
		verifyCode,
		setVerifyCode,
		handleSubmit,
		handleVerify,
		handleResendCode,
	} = useSignUpForm(props);

	const {
		register,
		formState: { errors },
	} = form;

	if (step === "verify") {
		return (
			<div>
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold text-text">Verify your email</h1>
					<p className="mt-1 text-sm text-text-secondary">
						We sent a verification code to {emailAddress}
					</p>
				</div>

				<Card>
					{generalError && (
						<div
							role="alert"
							className="mb-4 rounded-lg border border-error/30 bg-error-muted p-3 text-sm text-error"
						>
							{generalError}
						</div>
					)}

					<div className="space-y-4">
						<div>
							<Label htmlFor="code">Verification code</Label>
							<Input
								id="code"
								placeholder="Enter 6-digit code"
								value={verifyCode}
								onChange={(e) => setVerifyCode(e.target.value)}
								className="mt-1"
							/>
						</div>

						<Button
							type="button"
							onClick={handleVerify}
							disabled={isLoading || !verifyCode}
							className="w-full"
						>
							{isLoading ? "Verifying..." : "Verify Email"}
						</Button>

						<button
							type="button"
							onClick={handleResendCode}
							disabled={isLoading}
							className="w-full text-sm text-primary hover:underline"
						>
							Resend code
						</button>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold text-text">Create your account</h1>
				<p className="mt-1 text-sm text-text-secondary">
					Get started with your new account
				</p>
			</div>

			<Card>
				<OAuthButtons label="sign_up" />

				{generalError && (
					<div
						role="alert"
						className="mb-4 rounded-lg border border-error/30 bg-error-muted p-3 text-sm text-error"
					>
						{generalError}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="firstName">First name</Label>
							<Input
								id="firstName"
								placeholder="John"
								{...register("firstName")}
								className="mt-1"
							/>
							{errors.firstName && (
								<p className="mt-1 text-sm text-error">
									{errors.firstName.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="lastName">Last name</Label>
							<Input
								id="lastName"
								placeholder="Doe"
								{...register("lastName")}
								className="mt-1"
							/>
							{errors.lastName && (
								<p className="mt-1 text-sm text-error">
									{errors.lastName.message}
								</p>
							)}
						</div>
					</div>

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
						<Label htmlFor="password">Password</Label>
						<div className="relative mt-1">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="At least 8 characters"
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

					<div>
						<Label htmlFor="confirmPassword">Confirm password</Label>
						<div className="relative mt-1">
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Re-enter your password"
								{...register("confirmPassword")}
							/>
							<button
								type="button"
								onClick={toggleConfirmPassword}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted"
							>
								{showConfirmPassword ? (
									<EyeOff size={18} />
								) : (
									<Eye size={18} />
								)}
							</button>
						</div>
						{errors.confirmPassword && (
							<p className="mt-1 text-sm text-error">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full"
					>
						{isLoading ? "Creating account..." : "Create Account"}
					</Button>
				</form>
			</Card>

			<p className="mt-4 text-center text-sm text-text-secondary">
				Already have an account?{" "}
				<Link to="/login" className="text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	);
}
