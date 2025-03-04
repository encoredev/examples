import type { IncomingMessage } from "node:http";
import { createClerkClient } from "@clerk/backend";
import { APIError, Header, api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import log from "encore.dev/log";
import Stripe from "stripe";
import { getAuthData } from "~encore/auth";
import { db } from "./db";

// These endpoints follow the Stripe Billing Quickstart guide.
// Please refer to https://docs.stripe.com/billing/quickstart for more information.

const stripeSecretKey = secret("StripeSecretKey");
//const stripeWebhookSigningSecret = secret('StripeWebhookSigningSecret')
const stripeWebhookSigningSecret = () =>
	"whsec_052d37aa1d2c923118e2ae534ad2c03de84edfc4663b76103e459224cba94664";

const stripe = new Stripe(stripeSecretKey());

// This secret is defined in Encore.
// See https://encore.dev/docs/ts/primitives/secrets for more information.
const clerkSecretKey = secret("ClerkSecretKey");

const clerk = createClerkClient({
	secretKey: clerkSecretKey(),
});

// Extract the body from an incoming request.
function getBody(req: IncomingMessage): Promise<string> {
	return new Promise((resolve) => {
		const bodyParts: Uint8Array[] = [];
		req
			.on("data", (chunk) => {
				bodyParts.push(chunk);
			})
			.on("end", () => {
				resolve(Buffer.concat(bodyParts).toString());
			});
	});
}

// Handle stripe webhook events
export const stripeWebhookHandler = api.raw(
	{
		method: "POST",
		expose: true,
		path: "/stripe/webhook",
	},
	async (req, res) => {
		try {
			const body = await getBody(req);
			const stripeSignature = req.headers["stripe-signature"] as string;

			const event = stripe.webhooks.constructEvent(
				body,
				stripeSignature,
				stripeWebhookSigningSecret(),
			);

			log.debug("received stripe webhook", { event });

			switch (event.type) {
				// Handle subscription events
				case "customer.subscription.updated":
				case "customer.subscription.created": {
					const subscription = event.data.object;
					await db.exec`
        INSERT INTO subscription (stripe_id, stripe_customer_id, price_id, status, created_at, updated_at)
        VALUES (
          ${subscription.id as string},
          ${subscription.customer as string},
          ${subscription.items.data[0].plan.id as string},
          ${subscription.status as string},
          ${new Date(subscription.created * 1000)},
          ${new Date(subscription.created * 1000)}
        )
        ON CONFLICT (stripe_id) DO UPDATE SET
          stripe_customer_id = ${subscription.customer as string},
          price_id = ${subscription.items.data[0].plan.id as string},
          status = ${subscription.status as string},
          updated_at = ${new Date(subscription.created * 1000)}
        `;
					break;
				}
			}

			res.write(JSON.stringify({ received: true }));
			res.writeHead(200);
			res.end();
		} catch (error) {
			log.error("stripe webhook error", { error });

			res.write(JSON.stringify({ received: false }));
			res.writeHead(500);
			res.end();
		}
	},
);

interface CreateCheckoutSessionParams {
	priceId: string;
}

interface CreateCheckoutSessionResponse {
	// The URL to redirect to
	url: string;
}

// Generate a checkout session
export const createCheckoutSession = api(
	{
		method: "POST",
		path: "/stripe/checkout-session",
		expose: true,
		auth: true,
	},
	async (
		params: CreateCheckoutSessionParams,
	): Promise<CreateCheckoutSessionResponse> => {
		const authData = getAuthData();
		if (!authData) {
			throw APIError.unauthenticated("user not authenticated");
		}

		const org = await clerk.organizations.getOrganization({
			organizationId: authData.orgID,
		});
		const stripeCustomerId = org.privateMetadata.stripeCustomerId;

		const session = await stripe.checkout.sessions.create({
			billing_address_collection: "auto",
			customer: stripeCustomerId,
			line_items: [
				{
					price: params.priceId,
					// For metered billing, do not pass quantity
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url:
				"http://localhost:3000/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}",
			cancel_url: "http://localhost:3000/dashboard/subscription?canceled=true",
		});

		// If the user doesn't have a Stripe customer ID yet, set it
		if (!stripeCustomerId) {
			clerk.organizations.updateOrganizationMetadata(authData.orgID, {
				privateMetadata: {
					stripeCustomerId: session.customer as string,
				},
			});
		}

		return { url: session.url ?? "" };
	},
);

interface CreatePortalSessionResponse {
	url: string;
}

// Generate a portal session to manage subscriptions
export const createPortalSession = api(
	{
		method: "POST",
		path: "/stripe/portal-session",
		expose: true,
		auth: true,
	},
	async (): Promise<CreatePortalSessionResponse> => {
		const authData = getAuthData();
		if (!authData) {
			throw APIError.unauthenticated("user not authenticated");
		}

		const org = await clerk.organizations.getOrganization({
			organizationId: authData.orgID,
		});
		const stripeCustomerId = org.privateMetadata.stripeCustomerId;

		if (!stripeCustomerId) {
			throw APIError.notFound("user does not have a Stripe customer ID");
		}

		const session = await stripe.billingPortal.sessions.create({
			customer: stripeCustomerId,
			return_url: "http://localhost:3000/dashboard/subscription",
		});

		return { url: session.url ?? "" };
	},
);

interface GetSubscriptionsResponse {
	id: string;
	priceId: string;
}

// Get the current subscription if any
export const getSubscription = api(
	{
		method: "GET",
		path: "/stripe/subscriptions",
		expose: true,
		auth: true,
	},
	async (): Promise<GetSubscriptionsResponse> => {
		const authData = getAuthData();
		if (!authData) {
			throw APIError.unauthenticated("user not authenticated");
		}

		const org = await clerk.organizations.getOrganization({
			organizationId: authData.orgID,
		});
		const stripeCustomerId = org.privateMetadata.stripeCustomerId;

		if (!stripeCustomerId) {
			throw APIError.notFound(
				"organization does not have a Stripe customer ID",
			);
		}

		const subscriptions = await stripe.subscriptions.list({
			customer: stripeCustomerId,
			limit: 1,
		});

		if (subscriptions.data.length === 0) {
			throw APIError.notFound("no active subscription");
		}

		const subscription = subscriptions.data[0];

		return {
			id: subscription.id,
			priceId: subscription.items.data[0].price.id as string,
		};
	},
);
