import { APICallMeta } from "encore.dev";
import { APIError, middleware } from "encore.dev/api";
import { Service } from "encore.dev/service";
import { getAuthData } from "~encore/auth";

// a authorization middleware that only allows users to make
// modifications on themselves.
const permissionMw = middleware(
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
  middlewares: [permissionMw],
});
