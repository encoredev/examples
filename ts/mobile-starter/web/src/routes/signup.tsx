import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/auth-layout/auth-layout";
import { SignUpForm } from "@/features/auth/signup-form/signup-form";

export const Route = createFileRoute("/signup")({
	beforeLoad: ({ context }) => {
		if (!context.auth.isLoading && context.auth.user) {
			throw redirect({ to: "/_app/dashboard" });
		}
	},
	component: SignUp,
});

function SignUp() {
	const navigate = useNavigate();

	return (
		<AuthLayout>
			<SignUpForm onSuccess={() => navigate({ to: "/_app/dashboard" })} />
		</AuthLayout>
	);
}
