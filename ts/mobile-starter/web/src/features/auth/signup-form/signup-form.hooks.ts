import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/lib/auth-provider";
import { apiClient } from "@/lib/api/client";
import { signUpFormSchema } from "./signup-form.schema";
import type {
	SignUpFormData,
	SignUpFormProps,
	SignUpStep,
} from "./signup-form.types";

export function useSignUpForm(props?: SignUpFormProps) {
	const { onSuccess } = props ?? {};
	const { signUp, storeSession } = useAuth();

	const [step, setStep] = useState<SignUpStep>("form");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [generalError, setGeneralError] = useState("");
	const [verifyCode, setVerifyCode] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [pendingToken, setPendingToken] = useState("");

	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const togglePassword = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	const toggleConfirmPassword = useCallback(() => {
		setShowConfirmPassword((prev) => !prev);
	}, []);

	const handleSubmit = useCallback(
		async (data: SignUpFormData) => {
			setIsLoading(true);
			setGeneralError("");

			try {
				const result = await signUp(
					data.email,
					data.password,
					data.firstName,
					data.lastName,
				);

				if (result.status === "verify_email") {
					setEmailAddress(data.email);
					setPendingToken(result.pendingAuthenticationToken ?? "");
					setStep("verify");
				} else if (result.status === "complete") {
					onSuccess?.();
				}
			} catch (err) {
				setGeneralError(
					err instanceof Error
						? err.message
						: "Something went wrong. Please try again.",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[signUp, onSuccess],
	);

	const handleVerify = useCallback(async () => {
		setIsLoading(true);
		setGeneralError("");

		try {
			const result = await apiClient.auth.verifyEmail({
				code: verifyCode,
				pendingAuthenticationToken: pendingToken,
			});

			storeSession(result);
			onSuccess?.();
		} catch (err) {
			setGeneralError(
				err instanceof Error
					? err.message
					: "Invalid verification code. Please try again.",
			);
		} finally {
			setIsLoading(false);
		}
	}, [verifyCode, pendingToken, storeSession, onSuccess]);

	const handleResendCode = useCallback(async () => {
		const data = form.getValues();
		setIsLoading(true);
		setGeneralError("");

		try {
			const result = await signUp(
				data.email,
				data.password,
				data.firstName,
				data.lastName,
			);
			if (result.pendingAuthenticationToken) {
				setPendingToken(result.pendingAuthenticationToken);
			}
		} catch {
			setGeneralError("Failed to resend code. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, [form, signUp]);

	return {
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
		handleSubmit: form.handleSubmit(handleSubmit),
		handleVerify,
		handleResendCode,
	};
}
