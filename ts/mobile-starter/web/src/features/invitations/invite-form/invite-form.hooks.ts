import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api/client";
import { inviteFormSchema, type InviteFormData } from "./invite-form.schema";

export function useInviteForm(onSuccess?: () => void) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const form = useForm<InviteFormData>({
		resolver: zodResolver(inviteFormSchema),
		defaultValues: { email: "", role: "member" },
	});

	const handleSubmit = useCallback(
		async (data: InviteFormData) => {
			setIsLoading(true);
			setError("");
			setSuccess("");

			try {
				await apiClient.auth.sendInvitation({
					email: data.email,
					role: data.role,
				});
				setSuccess(`Invitation sent to ${data.email}`);
				form.reset();
				onSuccess?.();
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to send invitation.",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[form, onSuccess],
	);

	return {
		form,
		isLoading,
		error,
		success,
		handleSubmit: form.handleSubmit(handleSubmit),
	};
}
