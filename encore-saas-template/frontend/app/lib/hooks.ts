import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getRequestClient from "./getRequestClient";
import client, { user } from "./client";
import { toast } from "sonner";

export const useUser = (token: string | null) => {
    const requestClient = getRequestClient(token ?? undefined)
    
    const { data: userData, isLoading: isUserDataLoading } = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => requestClient.user.GetUser(),
        enabled: !!token,
    });

    return { userData, isUserDataLoading }
};

export const useCurrentPlan = (token: string | null) => {
    const requestClient = getRequestClient(token ?? undefined)
    const { data: currentPlan, isLoading: isCurrentPlanLoading } = useQuery({
        queryKey: ["products", "currentPlan"],
        queryFn: async () => {
            const userData = await requestClient.user.GetUser();
            const products = await requestClient.product.GetProducts();
            const response = await requestClient.subscription.GetSubscriptions({
                user_id: userData.id,
            });
            const subscription = response.subscriptions[0];
            const product = products.products.find((product) => product.id === subscription.stripe_product_id);
            return product?.name;
        },
        enabled: !!token,
    });

    return { currentPlan, isCurrentPlanLoading }
}

export const useActivities = (token: string | null, offset: number, limit: number) => {
    const requestClient = getRequestClient(token ?? undefined)
    const { data: activities, isLoading: isActivitiesLoading, error } = useQuery({
        queryKey: ["activities"],
        queryFn: async () => {
            const activities = await requestClient.activity.GetActivities({ offset, limit });
            const users = await Promise.all(activities.activities.map(async (activity) => {
                const user = await requestClient.user.GetUserById(activity.user_id);
                return { ...activity, user };
            }));
            return users;
        },
    });

    return { activities, isActivitiesLoading, error }
}

export const useProducts = (token: string | null) => {
    const requestClient = getRequestClient(token ?? undefined)
    const { data: products, isLoading: isProductsLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => requestClient.product.GetProducts(),
    });

    return { products, isProductsLoading }
}

export const useUpdateUserMutation = (token: string | null) => {
    const requestClient = getRequestClient(token ?? undefined)
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ userId, request }: { userId: string, request: user.UpdateUserRequest }) => requestClient.user.UpdateUser(userId, request),
        onError: () => {
            toast.error("Failed to update user")
        },
        onSuccess: () => {
            toast.success("User updated")
            queryClient.invalidateQueries({ queryKey: ["users", "me"] })
        }
    });
}

