import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }) => {
		if (!context.auth.isLoading && context.auth.user) {
			throw redirect({ to: "/_app/dashboard" });
		}
		throw redirect({ to: "/login" });
	},
});
