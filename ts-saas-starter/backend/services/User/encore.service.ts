import {Service} from "encore.dev/service";
import {SQLDatabase} from "encore.dev/storage/sqldb";
import {Bucket} from "encore.dev/storage/objects";
import {APIError, Gateway, Header} from "encore.dev/api";
import {authHandler} from "encore.dev/auth";
import {betterAuth} from "better-auth";
import {admin} from "better-auth/plugins";
import pg from "pg";
import {stripe} from "@better-auth/stripe";
import Stripe from "stripe";
import {secret} from "encore.dev/config";

// -------------------- //
// Encore Service Setup //
// -------------------- //

export const UserDB = new SQLDatabase("UserDB", {migrations: "./migrations"});

export const profilePictures = new Bucket("profile-pictures", {versioned: false, public: false});

export default new Service("User");


// ------------------ //
// Auth Handler Setup //
// ------------------ //

// Update AuthParams to include the Cookie header
interface AuthParams {
    cookie: Header<"Cookie">;
}

interface AuthData {
    userID: string;
}

// Authentication handler implementation
export const handler = authHandler<AuthParams, AuthData>(async (params) => {
    const cookieHeader = params.cookie;

    if (!cookieHeader) throw APIError.unauthenticated("Not authenticated");

    try {
        // Parse the cookie string to find the better-auth session token
        const cookieMap = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key.trim()] = value;
            return acc;
        }, {} as Record<string, string>);

        const sessionToken = cookieMap['better-auth.session_token'];

        if (!sessionToken) throw APIError.unauthenticated("No session token found");

        // Create headers with the session cookie
        const headers = new Headers();
        headers.append("Cookie", `better-auth.session_token=${sessionToken}`);

        // Try to get the session using the cookie
        const session = await auth.api.getSession({
            headers: headers
        });

        if (!session || !session.user || !session.user.id) {
            throw APIError.unauthenticated("Invalid session");
        }

        return {
            userID: session.user.id
        };
    } catch (error) {
        throw APIError.unauthenticated("Invalid session");
    }
});

export const gateway = new Gateway({authHandler: handler});

// ------------------ //
// Stripe Client Setup //
// ------------------ //

const stripeSecret = secret("StripeSecretKey");
const StripeWebhookKey = secret("StripeWebhookKey");
const stripeClient = new Stripe(stripeSecret());

// Make sure we have a valid Stripe client before proceeding
if (!stripeClient) {
    console.error("WARNING: Stripe client could not be initialized due to missing API key!");
    console.error("Stripe-related functionality will not work correctly.");
}

// ------------------------------------------------- //
// Initialize Better Auth with the Postgres database //
// ------------------------------------------------- //

const {Pool} = pg;

export const auth: any = betterAuth({
    database: new Pool({connectionString: UserDB.connectionString}),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4000"
    ],
    advanced: {
        defaultCookieAttributes: {
            secure: true,
            httpOnly: true,
            sameSite: "none",
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },
    user: {
        deleteUser: {
            enabled: true
        }
    },
    plugins: [
        admin(),
        stripe({
            stripeClient,
            stripeWebhookSecret: StripeWebhookKey(),
            createCustomerOnSignUp: true,
            subscription: {
                enabled: true,
                plans: [
                    {
                        name: "basic",
                        priceId: "price_id",
                        limits: {
                            projects: 5,
                            storage: 10
                        }
                    },
                    // Add more plans as needed
                ]
            }
        })
    ]
});