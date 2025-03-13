"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useApiClient } from "@/lib/api/client-side";
import { useQuery } from "@tanstack/react-query";

/**
 * This component shows how you can fetch data from the encore backend using client components.
 */
export function ClientSideData() {
	const apiClient = useApiClient();

	const { data } = useQuery({
		queryKey: ["dashboardData"],
		queryFn: () => apiClient.admin.getDashboardData(),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Client side data</CardTitle>
				<CardDescription>
					This data is fetched from the backend using client components
				</CardDescription>
			</CardHeader>
			<CardContent>{JSON.stringify(data)}</CardContent>
		</Card>
	);
}
