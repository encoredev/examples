import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/auth-layout/auth-layout";
import { LoginForm } from "@/features/auth/login-form/login-form";

export const Route = createFileRoute("/login")({
	beforeLoad: ({ context }) => {
		if (!context.auth.isLoading && context.auth.user) {
			throw redirect({ to: "/_app/dashboard" });
		}
	},
	component: Login,
});

function Login() {
	const navigate = useNavigate();

	return (
		<AuthLayout>
			<LoginForm onSuccess={() => navigate({ to: "/_app/dashboard" })} />
		</AuthLayout>
	);
}
