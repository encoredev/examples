import { APIError } from 'encore.dev/api';
import log from 'encore.dev/log';

/**
 * Wraps a function in a try/catch block to handle errors and log them
 * @param fn The function to wrap
 * @param internalErrorMsg The error message to use if an error occurs
 * @returns The result of the function
 */
export async function withErrorHandling<T>(fn: () => Promise<T>, internalErrorMsg: string): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        if (error instanceof APIError) {
            log.error(error);
            throw error;
        }

        log.error(error);
        throw APIError.internal(`${internalErrorMsg}: ${error.message}`);
    }
}
