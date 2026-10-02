import type { z } from "zod";
import type { signUpFormSchema } from "./signup-form.schema";

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export type SignUpStep = "form" | "verify";

export interface SignUpFormProps {
	onSuccess?: () => void;
}
