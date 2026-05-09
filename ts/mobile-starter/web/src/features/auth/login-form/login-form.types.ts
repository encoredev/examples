import type { z } from "zod";
import type { loginFormSchema } from "./login-form.schema";

export type LoginFormData = z.infer<typeof loginFormSchema>;

export interface LoginFormProps {
	onSuccess?: () => void;
}
