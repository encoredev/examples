import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  APIError,
  ErrCode,
  isAPIError,
  type subscription,
} from "@/lib/api/encore-client";
import { getApiClient } from "@/lib/api/server-side";
import { plans } from "@/lib/plans";
import { auth } from "@clerk/nextjs/server";
import { ChevronDown, Usb } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SubscriptionPageProps {
  searchParams: Promise<{
    success?: boolean;
    session_id?: string;
    canceled?: boolean;
  }>;
}

export default async function SubscriptionPage(
  props: Readonly<SubscriptionPageProps>,
) {
  const { success, session_id, canceled } = await props.searchParams;

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const apiClient = await getApiClient();

  let currentSubscription: subscription.GetSubscriptionsResponse | undefined;
  try {
    currentSubscription = await apiClient.subscription.getSubscription();
  } catch (error) {
    if (!(isAPIError(error) && error.code === ErrCode.NotFound)) {
      throw error;
    }
  }

  const createCheckoutSession = async (formData: FormData) => {
    "use server";
    const stripePriceId = formData.get("stripePriceId") as string;

    const serverApiClient = await getApiClient();
    const session = await serverApiClient.subscription.createCheckoutSession({
      priceId: stripePriceId,
    });
    redirect(session.url);
  };

  const createPortalSession = async () => {
    "use server";
    const serverApiClient = await getApiClient();
    const session = await serverApiClient.subscription.createPortalSession();
    redirect(session.url);
  };

  const currentPlan = plans.find(
    (plan) => plan.stripePriceId === currentSubscription?.priceId,
  );

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

        <CardContent>
          {success === true && (
            <p>You have successfully subscribed to the plan.</p>
          )}

          {canceled === true && <p>The checkout has been canceled.</p>}

          {currentPlan && (
            <div className="flex flex-col gap-2">
              <p>
                Your current plan is {currentPlan.name} - €{currentPlan.price}
                /month.
              </p>

              <form action={createPortalSession}>
                <Button type="submit">Manage Subscription</Button>
              </form>
            </div>
          )}

          {success === undefined && currentPlan === undefined && (
            <form action={createCheckoutSession} className="flex flex-col gap-2 items-start">
              <p>Select plan</p>
              <RadioGroup
                defaultValue={plans[0].stripePriceId}
                name="stripePriceId"
              >
                {plans.map((plan) => (
                  <div
                    className="flex items-center space-x-2"
                    key={plan.name}
                  >
                    <RadioGroupItem
                      value={plan.stripePriceId}
                      id={plan.stripePriceId}
                    />
                    <Label htmlFor={plan.stripePriceId}>
                      {plan.name} - €{plan.price}/month
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
