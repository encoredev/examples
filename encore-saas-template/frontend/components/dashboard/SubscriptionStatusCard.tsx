'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createCustomerPortalSession } from "@/app/lib/api"
import { product } from "@/app/lib/client"
import { useFirebase } from "@/app/lib/firebase/FirebaseProvider"
import getRequestClient from "@/app/lib/getRequestClient"
import { CreditCard, AlertCircle, RefreshCw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

const getStatusColor = (status: string | null): string => {
    if (!status) return "bg-zinc-100 text-zinc-800";
    
    switch (status.toLowerCase()) {
        case "active":
            return "bg-green-100 text-green-800";
        case "trialing":
            return "bg-blue-100 text-blue-800";
        case "canceled":
            return "bg-red-100 text-red-800";
        case "incomplete":
        case "incomplete_expired":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-zinc-100 text-zinc-800";
    }
};

interface SubscriptionState {
    status: string | null;
    productName: string | null;
    isLoading: boolean;
    isPolling: boolean;
    error: string | null;
    lastUpdated: Date | null;
    pollCount: number;
    cancel_at_period_end: boolean;
    cancel_at: Date | null;
}

interface CachedData {
    userId: string;
    products: product.Product[];
}

const MAX_POLL_ATTEMPTS = 5;
const BASE_POLL_INTERVAL = 1000;
const MAX_POLL_INTERVAL = 30000;

const calculateBackoffDelay = (attempt: number): number => {
    return Math.min(Math.pow(2, attempt) * BASE_POLL_INTERVAL, MAX_POLL_INTERVAL);
};

export const SubscriptionStatusCard = () => {
    const { user } = useFirebase()
    const searchParams = useSearchParams()
    const router = useRouter();
    
    const [state, setState] = useState<SubscriptionState>({
        status: null,
        productName: null,
        isLoading: false,
        isPolling: false,
        error: null,
        lastUpdated: null,
        pollCount: 0,
        cancel_at_period_end: false,
        cancel_at: null
    });

    const [cachedData, setCachedData] = useState<CachedData | null>(null);

    const fetchSubscriptionStatus = useCallback(async (userId: string, products: product.Product[]) => {
        try {
            const requestClient = getRequestClient(await user?.getIdToken())
            const subscriptions = await requestClient.subscription.GetSubscriptions({
                user_id: userId
            })

            const activeSubscription = subscriptions.subscriptions[0] // Assuming first subscription is the active one
            const product = activeSubscription ? products.find(p => p.id === activeSubscription.stripe_product_id) : null

            setState(prev => ({
                ...prev,
                status: activeSubscription?.subscription_status || null,
                productName: product?.name || null,
                lastUpdated: new Date(),
                error: null,
                isLoading: false,
                cancel_at: activeSubscription?.cancel_at ? new Date(activeSubscription.cancel_at) : null,
                cancel_at_period_end: activeSubscription?.cancel_at_period_end || false
            }))

            return !!activeSubscription
        } catch (error) {
            console.error('Error fetching subscription status:', error)
            setState(prev => ({
                ...prev,
                error: 'Failed to fetch subscription status',
                isLoading: false
            }))
            return false
        }
    }, [user]);

    const fetchInitialData = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))
            const requestClient = getRequestClient(await user?.getIdToken())
            
            const [userData, productsResponse] = await Promise.all([
                requestClient.user.GetUser(),
                requestClient.product.GetProducts()
            ])

            if (!productsResponse) {
                throw new Error('Failed to fetch products')
            }
            setCachedData({
                userId: userData.id,
                products: productsResponse.products
            })

            await fetchSubscriptionStatus(userData.id, productsResponse.products)
            
        } catch (error) {
            console.error('Error fetching initial data:', error)
            setState(prev => ({
                ...prev,
                error: 'Failed to initialize subscription data',
                isLoading: false
            }))
        }
    }, [user, fetchSubscriptionStatus]);

    const poll = useCallback(async (cachedData: CachedData, attemptNumber = 0) => {
        if (attemptNumber >= MAX_POLL_ATTEMPTS) {
            setState(prev => ({ ...prev, isPolling: false }));
            return;
        }

        setState(prev => ({ ...prev, pollCount: attemptNumber }));

        const hasActiveSubscription = await fetchSubscriptionStatus(cachedData.userId, cachedData.products);
        
        if (hasActiveSubscription) {
            setState(prev => ({ ...prev, isPolling: false }));
        } else {
            const nextAttempt = attemptNumber + 1;
            setState(prev => ({ ...prev, pollCount: nextAttempt }));
            
            const delay = calculateBackoffDelay(nextAttempt);
            console.log(`Polling attempt ${nextAttempt}/${MAX_POLL_ATTEMPTS}, next attempt in ${delay/1000}s`);
            
            if (nextAttempt < MAX_POLL_ATTEMPTS) {
                setTimeout(() => poll(cachedData, nextAttempt), delay);
            } else {
                setState(prev => ({ ...prev, isPolling: false }));
            }
        }
    }, [fetchSubscriptionStatus]);

    const startPolling = useCallback(async () => {
        if (!cachedData) return;
        
        setState(prev => ({ ...prev, isPolling: true, pollCount: 0 }));
        poll(cachedData, 0);
    }, [cachedData, poll]);

    const handleStripeRedirect = useCallback(async () => {
        const success = searchParams.get('success')
        const sessionId = searchParams.get('session_id')

        if (success === 'true' && sessionId) {
            startPolling()
        }
    }, [searchParams, startPolling]);

    useEffect(() => {
        if (user) {
            handleStripeRedirect()
        }
    }, [user, handleStripeRedirect])

    useEffect(() => {
        if (user && !cachedData) {
            fetchInitialData();
        }
    }, [user, cachedData, fetchInitialData]);

    const handleManageSubscription = async () => {
        try {
            if (!cachedData?.products.length) {
                toast.error('No subscription products available')
                return
            }
            // set loading to true
            setState(prev => ({ ...prev, isLoading: true }))
            const token = await user?.getIdToken();
            await createCustomerPortalSession(token, router);
        } catch (error) {
            console.error('Error creating checkout session:', error)
            toast.error('Failed to manage subscription')
        } finally {
            setState(prev => ({ ...prev, isLoading: false }))
        }
    }

    const handleRefresh = async () => {
        if (!cachedData) return;
        setState(prev => ({ ...prev, isLoading: true }))
        await fetchSubscriptionStatus(cachedData.userId, cachedData.products)
    }

    return (
        <Card className="bg-white border-zinc-100">
            <div className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-black">Subscription Status</h2>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(state.status)}`}>
                                {state.isPolling ? "Updating..." : (state.status || "Free Plan")}
                            </span>
                            {state.isLoading && !state.isPolling && (
                                <RefreshCw className="h-4 w-4 animate-spin text-zinc-500" />
                            )}
                        </div>
                        <p className="text-sm text-zinc-500">
                            {state.status ? `Current plan: ${state.productName}` : "No active subscription"}
                        </p>
                        {state.cancel_at_period_end && (
                            <p className="text-xs text-red-600">
                                Subscription will end on {state.cancel_at ? state.cancel_at.toLocaleDateString() : "the end of the current period"}
                            </p>
                        )}
                        {state.lastUpdated && (
                            <p className="text-xs text-zinc-400">
                                Last updated: {state.lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                        {state.error && (
                            <div className="flex items-center text-red-500 text-sm mt-1">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {state.error}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleRefresh}
                            disabled={state.isLoading || state.isPolling}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                            className="bg-black text-white hover:bg-zinc-800 transition-colors"
                            size="lg"
                            onClick={handleManageSubscription}
                            disabled={state.isLoading || state.status === null }
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Subscription
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
