"use client";

import {
	QueryClient,
	QueryClientProvider as TanstackQueryProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

/**
 * This component provides a QueryClient to the application.
 * See https://tanstack.com/query/latest/docs/framework/react/overview for more information on tanstack react-query.
 */
export function QueryClientProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<TanstackQueryProvider client={queryClient}>
			{children}
		</TanstackQueryProvider>
	);
}
