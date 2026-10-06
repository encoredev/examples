import { useRouter } from "next/navigation";
import getRequestClient from "./getRequestClient";
import { toast } from "sonner";

export const handleSubscription = async (
    token: string | undefined,
    priceID: string,
    router: ReturnType<typeof useRouter>
) => {
    try {
        if (!token) {
            router.push('/signup');
            return;
        }

        const client = getRequestClient(token);
        const response = await client.subscription.CreateCheckoutSession({ price_id: priceID });

        if (response.url) {
            window.location.href = response.url;
        }
    } catch (error) {
        toast.error('Failed to create checkout session');
    }
};

export async function createCustomerPortalSession(token: string | undefined, router: ReturnType<typeof useRouter>) {
    try {
        if (!token) {
            router.push('/signup');
            return;
        }

        const client = getRequestClient(token);
        const response = await client.subscription.CreateCustomerPortalSession();

        if (response.url) {
            window.location.href = response.url;
        }
    } catch (error) {
        toast.error('Failed to create checkout session');
    }
}
