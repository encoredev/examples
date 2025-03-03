import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { plans } from "@/lib/plans";
import { auth } from "@clerk/nextjs/server";
import { ChevronDown, Usb } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {

  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }


  return (
    <main className="container">
      <h1>Subscription</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Manage your subscription plan and billing information.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center gap-4">

          You are currently on the free plan.

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Select plan <ChevronDown /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {plans.map((plan) => (
                <Link href={`${plan.stripeLink}?${new URLSearchParams({ client_reference_id: userId })}`} key={plan.name}>
                  <DropdownMenuItem className="items-center justify-between gap-4">
                    <span>{plan.name}</span> <span className="text-muted-foreground">€{plan.price}/mo</span>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>

      </Card>
    </main>
  );
}
