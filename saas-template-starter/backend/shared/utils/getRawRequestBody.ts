import { IncomingMessage } from 'http';

/**
 * Get the raw request body from a request
 * @param req The request object
 * @returns The raw request body as a string
 */
export function getRawRequestBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve) => {
        const bodyParts: any[] = [];
        req.on('data', (chunk) => {
            bodyParts.push(chunk);
        }).on('end', () => {
            resolve(Buffer.concat(bodyParts).toString());
        });
    });
}
