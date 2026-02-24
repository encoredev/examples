import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/lib/auth-provider";
import { loginFormSchema } from "./login-form.schema";
import type { LoginFormData, LoginFormProps } from "./login-form.types";

export function useLoginForm(props?: LoginFormProps) {
	const { onSuccess } = props ?? {};
	const { signIn } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [generalError, setGeneralError] = useState("");

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: { email: "", password: "" },
	});

	const togglePassword = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	const handleSubmit = useCallback(
		async (data: LoginFormData) => {
			setIsLoading(true);
			setGeneralError("");

			try {
				const result = await signIn(data.email, data.password);

				if (result.status === "complete") {
					onSuccess?.();
				} else if (result.status === "verify_email") {
					setGeneralError(
						"Please verify your email address before signing in.",
					);
				} else if (result.status === "mfa_required") {
					setGeneralError("Multi-factor authentication is not yet supported.");
				}
			} catch (err) {
				setGeneralError(
					err instanceof Error
						? err.message
						: "Invalid email or password. Please try again.",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[signIn, onSuccess],
	);

	return {
		form,
		showPassword,
		togglePassword,
		isLoading,
		generalError,
		handleSubmit: form.handleSubmit(handleSubmit),
	};
}
