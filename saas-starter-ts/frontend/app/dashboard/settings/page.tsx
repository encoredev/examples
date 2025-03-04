import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
	return (
		<main className="container">
			<h1 className="text-3xl font-semibold mb-4">Settings</h1>

			<Card>
				<CardHeader>
					<CardTitle>Sign out</CardTitle>
				</CardHeader>
				<CardContent>
					<SignOutButton>
						<Button>
							Sign out <LogOut />
						</Button>
					</SignOutButton>
				</CardContent>
			</Card>
		</main>
	);
}
