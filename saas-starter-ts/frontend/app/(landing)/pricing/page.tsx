import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { plans } from "@/lib/plans";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
	return (
		<main className="container">
			<div className="flex flex-col items-center py-12">
				<h1 className="text-4xl font-bold mb-4">Pricing</h1>
				<p className="font-bold text-muted-foreground">
					Our pricing plans are designed to fit your needs.
				</p>
			</div>

			<div className="flex gap-4 justify-center items-stretch">
				{plans.map((plan) => (
					<Card key={plan.name} className="relative group">
						<Link href="/dashboard/subscription" className="absolute inset-0" />

						<CardHeader className="min-w-60">
							<CardTitle>{plan.name}</CardTitle>
							<CardDescription>
								<span className="text-4xl font-semibold">€{plan.price}</span> /
								month
							</CardDescription>
						</CardHeader>

						<CardContent className="grow">
							<p className="mb-4 font-medium">Includes</p>
							<ul className="text-muted-foreground">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-center">
										<Check className="size-4 mr-2" />
										{feature}
									</li>
								))}
							</ul>
						</CardContent>

						<CardFooter className="flex justify-center gap-2 group-hover:underline">
							Get started <ArrowRight className="size-4" />
						</CardFooter>
					</Card>
				))}
			</div>
		</main>
	);
}
