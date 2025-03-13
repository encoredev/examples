import { describe, expect, it } from "vitest";
import { getDashboardData } from "./dashboard";

// This is a simple test for the getDashboardData endpoint
// See https://encore.dev/docs/ts/develop/testing for more information on testing with encore
describe("getDashboardData", () => {
	it("should return dashboard data", async () => {
		const dashboardData = await getDashboardData();
		expect(dashboardData.totalOrders).toBeGreaterThan(0);
		expect(dashboardData.totalRevenue).toBeGreaterThan(0);
		expect(dashboardData.totalUsers).toBeGreaterThan(0);
	});
});
