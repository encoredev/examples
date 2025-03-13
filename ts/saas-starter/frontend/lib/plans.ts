export const plans = [
	{
		name: "Small",
		price: 8,
		features: ["Feature 1", "Feature 2", "Feature 3"],
		stripeProductId: "prod_RsP4IJeES8hBDu",
		stripePriceId: "price_1QyeDTGPZxkKVmuncIjFBYj7",
	},
	{
		name: "Medium",
		price: 20,
		features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
		stripeProductId: "prod_RsP2eL9TWCTqFR",
		stripePriceId: "price_1QyeEuGPZxkKVmunwbaiAkaO",
	},
	{
		name: "Large",
		price: 70,
		features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
		stripeProductId: "prod_RsP19mrNfkIeXG",
		stripePriceId: "price_1QyeFvGPZxkKVmunS8HJc1OS",
	},
] as const;
