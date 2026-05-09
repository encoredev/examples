import { z } from "zod";

export const inviteFormSchema = z.object({
	email: z
		.string()
		.min(1, "Email address is required")
		.email("Please enter a valid email address"),
	role: z.enum(["admin", "member"]),
});

export type InviteFormData = z.infer<typeof inviteFormSchema>;
