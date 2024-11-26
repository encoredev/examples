import { api } from "encore.dev/api";
import { anotherService } from "~encore/clients";

// Service to service communication example
// https://encore.dev/docs/ts/primitives/app-structure#multi-service-application-distributed-system
export const microserviceCommunication = api(
  { expose: true, method: "GET", path: "/call" },
  async (): Promise<{ message: string }> => {
    // Calling another service is just like calling a local function, with type-safety.
    // Encore will translate this function call into a service-to-service HTTP call.
    const fooResponse = await anotherService.foo();

    const msg = `Data from another service ${fooResponse.data}!`;
    return { message: msg };
  },
);
