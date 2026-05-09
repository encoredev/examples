import React, {useEffect, useState} from "react";
import {Button} from "../ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
import {Loader2} from "lucide-react";
import {authClient} from "../../lib/auth_client";
import {Alert, AlertDescription, AlertTitle} from "../ui/alert";

// Define proper types for subscription data
interface Subscription {
    id: string;
    plan: string;
    status: string;
    periodEnd?: string;
    periodStart?: string;
    cancelAtPeriodEnd?: boolean;
    trialEnd?: string;
    // Add any other properties that might be returned from the API
}

/**
 * BillingSection - Component for testing BetterAuth Stripe integration
 *
 * @param {Object} props - Component props
 * @param {Function} props.setError - Function to set error message
 * @param {Function} props.setSuccess - Function to set success message
 */
export const BillingSection: React.FC<{
    setError: (error: string | null) => void;
    setSuccess: (success: string | null) => void;
}> = ({setError, setSuccess}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);

    // Fetch user's subscription status on component mount
    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        try {
            const {data, error} = await authClient.subscription.list();

            if (error) {
                console.error("Error fetching subscriptions:", error);
                setError(`Failed to fetch subscriptions: ${error.message}`);
            } else {
                const subscriptionsData = data as Subscription[] || [];
                setSubscriptions(subscriptionsData);

                // Find active or trialing subscription
                const active = subscriptionsData.find(
                    (sub) => sub.status === "active" || sub.status === "trialing"
                );

                setActiveSubscription(active || null);
                if (active) {
                    setSuccess(`You have an active ${active.plan} subscription`);
                }
            }
        } catch (error: unknown) {
            // Handle unknown error type properly
            console.error("Error in subscription fetch:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            setError(`Error fetching subscription data: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubscribe = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const {error} = await authClient.subscription.upgrade({plan: "basic"});

            if (error) {
                throw new Error(error.message);
            }

            // The subscription.upgrade method will redirect to Stripe Checkout
            // No need to handle success here as it will redirect
        } catch (error: unknown) {
            console.error("Error creating subscription:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            setError(`Failed to create subscription: ${errorMessage}`);
            setIsProcessing(false);
        }
    };

    const handleCancelSubscription = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const {error} = await authClient.subscription.cancel({
                returnUrl: `${window.location.origin}/dashboard`,
            });

            if (error) {
                throw new Error(error.message);
            }

            // The subscription.cancel method will redirect to Stripe Billing Portal
            // No need to handle success here as it will redirect
        } catch (error: unknown) {
            console.error("Error canceling subscription:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            setError(`Failed to cancel subscription: ${errorMessage}`);
            setIsProcessing(false);
        }
    };

    // Display subscription count (using the subscriptions state)
    const subscriptionCount = subscriptions.length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stripe Integration Test</CardTitle>
                <CardDescription>
                    Test BetterAuth Stripe integration functionality
                    {subscriptionCount > 0 && ` (${subscriptionCount} subscription${subscriptionCount !== 1 ? 's' : ''} found)`}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Subscription Status */}
                <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Subscription Status</h3>
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                            <span>Loading subscription data...</span>
                        </div>
                    ) : activeSubscription ? (
                        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                            <AlertTitle>Active Subscription</AlertTitle>
                            <AlertDescription>
                                Plan: {activeSubscription.plan}<br/>
                                Status: {activeSubscription.status}<br/>
                                {activeSubscription.periodEnd && (
                                    <>Current period
                                        ends: {new Date(activeSubscription.periodEnd).toLocaleDateString()}</>
                                )}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                            <AlertTitle>No Active Subscription</AlertTitle>
                            <AlertDescription>
                                You don&#39;t have any active subscriptions.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchSubscriptions}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin"/>
                                    Refreshing...
                                </>
                            ) : (
                                "Refresh Status"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Subscription Actions */}
                <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Subscription Actions</h3>

                    <div className="space-y-4">
                        {!activeSubscription ? (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Subscribe to the basic plan to test the Stripe integration.
                                </p>
                                <Button
                                    onClick={handleSubscribe}
                                    disabled={isProcessing}
                                    className="w-full sm:w-auto"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Processing...
                                        </>
                                    ) : (
                                        "Subscribe to Basic Plan"
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Manage your existing subscription through the Stripe portal.
                                </p>
                                <Button
                                    onClick={handleCancelSubscription}
                                    disabled={isProcessing}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Processing...
                                        </>
                                    ) : (
                                        "Manage Subscription"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-sm text-muted-foreground mt-4 border-t pt-4">
                    <p>
                        <strong>Testing Notes:</strong> When testing, use Stripe test cards like
                        <code className="mx-1 px-1 py-0.5 bg-muted rounded">4242 4242 4242 4242</code>
                        with any future date and any CVC. For a failed payment, use
                        <code className="mx-1 px-1 py-0.5 bg-muted rounded">4000 0000 0000 0002</code>.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};