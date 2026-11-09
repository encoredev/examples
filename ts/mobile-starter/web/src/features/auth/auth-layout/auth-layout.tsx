import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
			<div className="w-full max-w-md">{children}</div>
		</div>
	);
}
