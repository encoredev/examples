import { api, APIError } from 'encore.dev/api';
import { getAuthData } from '~encore/auth';
import { userService } from '../services/user.service';
import { subscriptionTierService } from '../services/subscriptionTier.service';
import { Tier, User } from '../types';
import { UserJSON, WebhookEvent } from '@clerk/backend';
import { Webhook } from 'svix';
import { secret } from 'encore.dev/config';

const webhookSecret = secret('WebhookSecret');

/**
 * This endpoint is used to get a user by their ID.
 * It is a public endpoint, so it does not require authentication.
 */
export const findUser = api(
    { expose: true, method: 'GET', path: '/users/:id', auth: false },
    async (params: { id: string }): Promise<User> => {
        return userService.findOne(params.id);
    }
);

/**
 * This endpoint is used to get a user by their email.
 * It is not exposed to the frontend, so it is not a public endpoint.
 */
export const findUserByEmail = api(
    { expose: false, method: 'GET', path: '/users/email/:email', auth: false },
    async (params: { email: string }): Promise<User> => {
        return userService.findOneByEmail(params.email);
    }
);

/**
 * This endpoint is used to create a user when a webhook is received from Clerk.
 * The webhook is sent when a user is created in Clerk.
 * To use this endpoint, you need to create a webhook in Clerk and set the URL to this endpoint.
 * For testing, you can use a tunnel tool like ngrok to expose your local server to the internet, or other similar tools.
 *
 * The webhook secret should taken from your clerk backend settings, and is used to ensure the webhook request is authentic.
 */
export const createUser = api.raw({ expose: true, method: 'POST', path: '/users' }, async (req, resp) => {
    console.log('Webhook received');

    const svixHeaders = {
        'svix-id': Array.isArray(req.headers['svix-id']) ? req.headers['svix-id'][0] : req.headers['svix-id'] ?? '',
        'svix-timestamp': Array.isArray(req.headers['svix-timestamp'])
            ? req.headers['svix-timestamp'][0]
            : req.headers['svix-timestamp'] ?? '',
        'svix-signature': Array.isArray(req.headers['svix-signature'])
            ? req.headers['svix-signature'][0]
            : req.headers['svix-signature'] ?? '',
    };

    if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
        resp.writeHead(400, { 'Content-Type': 'application/json' });
        resp.end(JSON.stringify({ error: 'Missing required Svix headers' }));
        return;
    }

    try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const payloadString = Buffer.concat(chunks).toString('utf-8');

        const wh = new Webhook(webhookSecret());
        const payload = (await wh.verify(payloadString, svixHeaders)) as WebhookEvent;

        const { id, email_addresses, first_name, last_name } = payload.data as UserJSON;

        const user = await userService.createOne({
            id,
            email: email_addresses[0].email_address,
            firstName: first_name ?? '',
            lastName: last_name ?? '',
        });

        if (!user) {
            resp.writeHead(400, { 'Content-Type': 'application/json' });
            resp.end(JSON.stringify({ error: 'User already exists' }));
            return;
        }

        await subscriptionTierService.createOne({ userId: user.id, tier: Tier.FREE });

        resp.writeHead(200, { 'Content-Type': 'application/json' });
        resp.end(JSON.stringify({ success: true }));
    } catch (err) {
        console.error('Webhook verification failed:', err);
        resp.writeHead(400, { 'Content-Type': 'application/json' });
        resp.end(JSON.stringify({ error: 'Webhook verification failed' }));
    }
});

/**
 * This endpoint is used to update a user's profile.
 * It requires authentication, so the user must be logged in.
 */
export const updateUser = api<User, void>(
    { expose: true, method: 'PUT', path: '/users/:id', auth: true },
    async (req) => {
        const userID = getAuthData()!.userID;
        if (req.id !== userID) {
            throw APIError.unauthenticated('You can only update your own profile');
        }
        return userService.updateOne(userID, req);
    }
);

/**
 * This endpoint is used to delete a user.
 * It requires authentication, so the user must be logged in.
 */
export const deleteUser = api(
    { expose: true, method: 'DELETE', path: '/users/:id', auth: true },
    async (params: { id: string }): Promise<void> => {
        const userID = getAuthData()!.userID;

        if (params.id !== userID) {
            throw APIError.unauthenticated('You can only delete your own profile');
        }

        return userService.deleteOne(userID);
    }
);
