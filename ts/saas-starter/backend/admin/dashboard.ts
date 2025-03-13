import { api } from "encore.dev/api";

interface DashboardData {
	totalUsers: number;
	totalOrders: number;
	totalRevenue: number;
}

/**
 * A simple authenticated API endpoint that returns some fake data
 */
export const getDashboardData = api(
	{ method: "GET", expose: true, auth: true },
	(): DashboardData => {
		return {
			totalUsers: 100,
			totalOrders: 50,
			totalRevenue: 1000,
		};
	},
);
