import { Service } from "encore.dev/service";

// Encore will consider this directory and all its subdirectories as part of the "hello" service.
// https://encore.dev/docs/ts/primitives/services

// hello service responds to requests with a personalized greeting.
export default new Service("hello");
