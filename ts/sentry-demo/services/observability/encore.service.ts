/**
 * @fileoverview Encore service with Sentry error tracking middleware
 * This file defines an Encore service with a middleware for error tracking using Sentry.
 */

import * as Sentry from '@sentry/node';
import { appMeta } from 'encore.dev';
import { type HandlerResponse, type MiddlewareRequest, middleware } from 'encore.dev/api';
import { secret } from 'encore.dev/config';
import { Service } from 'encore.dev/service';

/**
 * Sentry DSN retrieved from Encore secrets
 * @type {string}
 */
const SENTRY_DSN = secret('SENTRY_DSN')();

/**
 * Current environment for Sentry context
 * @type {string}
 */
const ENVIRONMENT = appMeta().environment.type || 'development';

/**
 * Initialize Sentry with configuration
 * This sets up error tracking with the appropriate DSN and environment
 */
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.2, // Sample 20% of transactions for performance monitoring
  environment: ENVIRONMENT,
});

/**
 * Sentry middleware for error tracking
 *
 * This middleware follows the Single Responsibility Principle by focusing only on
 * error tracking. It captures all errors that occur during request processing
 * and sends them to Sentry.
 *
 * @param {MiddlewareRequest} req - The incoming request object
 * @param {Function} next - The next middleware or handler in the chain
 * @returns {Promise<any>} The response from the next middleware or handler
 */
const sentryMiddleware = middleware(
  async (req: MiddlewareRequest, next: (req: MiddlewareRequest) => Promise<HandlerResponse>) => {
    try {
      // Process the request through the next middleware or handler
      const res = await next(req);
      return res;
    } catch (error) {
      // Capture any errors with Sentry for monitoring and alerting
      Sentry.captureException(error);

      // Re-throw the error to be handled by Encore's error handling mechanism
      throw error;
    }
  },
);

/**
 * Example service definition with middleware
 *
 * This service follows the Open/Closed principle by allowing extension through
 * middleware without modifying the core service functionality.
 */
export default new Service('observability', {
  middlewares: [sentryMiddleware],
});