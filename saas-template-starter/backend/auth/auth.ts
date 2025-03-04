import { createClerkClient, verifyToken } from '@clerk/backend';
import { APIError, Gateway, Header } from 'encore.dev/api';
import { authHandler } from 'encore.dev/auth';
import { secret } from 'encore.dev/config';

import log from 'encore.dev/log';
import { AUTHORIZED_PARTIES } from './config';

const clerkSecretKey = secret('ClerkSecretKey');

const clerkClient = createClerkClient({
    secretKey: clerkSecretKey()
});

interface AuthParams {
    authorization: Header<'Authorization'>;
}

/**
 * AuthData is the data that is returned from the auth handler
 * You can add any data you want to be available in the handler, as long as its available in the token
 */
interface AuthData {
    userID: string;
}

export const myAuthHandler = authHandler(async (params: AuthParams): Promise<AuthData> => {
    const token = params.authorization.replace('Bearer ', '');

    if (!token) {
        throw APIError.unauthenticated('no token provided');
    }

    try {
        const result = await verifyToken(token, {
            authorizedParties: AUTHORIZED_PARTIES,
            secretKey: clerkSecretKey()
        });

        /**
         * Get the user from the clerk client
         * This is where you can add any additional data you want to be available in the handler
         */
        const user = await clerkClient.users.getUser(result.sub);

        return {
            userID: user.id
        };
    } catch (e) {
        log.error(e);
        throw APIError.unauthenticated('invalid token', e as Error);
    }
});

export const mygw = new Gateway({ authHandler: myAuthHandler });
