import {createAuthClient} from "better-auth/react"
import {stripeClient} from "@better-auth/stripe/client"
import {Local} from "./encore_client";

export const authClient = createAuthClient({
    baseURL: Local,
    plugins: [
        stripeClient({
            subscription: true,
        }),
    ],
})
