import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getApiClient } from "@/lib/api/server-side";

export async function ServerSideData() {
	const apiClient = await getApiClient();
	const data = await apiClient.admin.GetDashboardData();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Server side data</CardTitle>
				<CardDescription>
					This data is fetched from the backend using server components
				</CardDescription>
			</CardHeader>
			<CardContent>{JSON.stringify(data)}</CardContent>
		</Card>
	);
}
