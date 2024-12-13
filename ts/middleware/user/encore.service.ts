import { APICallMeta } from "encore.dev";
import { APIError, middleware } from "encore.dev/api";
import { Service } from "encore.dev/service";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { getAuthData } from "~encore/auth";

const opts = {
  points: 1,
  duration: 5, // per second
};

const rateLimiter = new RateLimiterMemory(opts);

// Rate limiting middleware.
const rateLimiterMiddleware = middleware(
  // Should be applied to all endpoints that require authentication.
  { target: { auth: true } },
  async (req, next) => {
    const userID = getAuthData()!.userID;

    return rateLimiter
      .consume(userID)
      .then(async (rateLimiterRes) => {
        const res = await next(req);

        res.header.set(
          "Retry-After",
          (rateLimiterRes.msBeforeNext / 1000).toString(),
        );
        res.header.set("X-RateLimit-Limit", opts.points.toString());
        res.header.set(
          "X-RateLimit-Remaining",
          rateLimiterRes.remainingPoints.toString(),
        );
        res.header.set(
          "X-RateLimit-Reset",
          new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString(),
        );

        return res;
      })
      .catch((e) => {
        if (e instanceof APIError) throw e;
        throw APIError.resourceExhausted("Too Many Requests");
      });
  },
);

// Authorization middleware that only allows users to make modifications on themselves.
const permissionMiddleware = middleware(
  { target: { auth: true } },
  async (req, next) => {
    const apiCallMeta = req.requestMeta as APICallMeta;

    // check if this is a modifying request (PUT, POST, DELETE etc)
    if (apiCallMeta.method === "GET") {
      return await next(req);
    }

    // check if this is an endpoint with a id in its path params (e.g /users/:id)
    if (apiCallMeta.pathParams.id === undefined) {
      return await next(req);
    }

    const authedUser = getAuthData()!;

    // check if the logged in user is the same as the user being modified.
    if (authedUser.userID != apiCallMeta.pathParams.id) {
      throw APIError.permissionDenied(
        `user ${authedUser.userID} is not permitted to modify user ${apiCallMeta.pathParams.id}`,
      );
    }

    // run the handler
    return await next(req);
  },
);

export default new Service("user", {
  middlewares: [rateLimiterMiddleware, permissionMiddleware],
});
