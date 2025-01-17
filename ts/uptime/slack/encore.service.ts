import { Service } from "encore.dev/service";

// Encore will consider this directory and all its subdirectories as part of the "slack" service.
// https://encore.dev/docs/ts/primitives/services

// The slack service is used to send messages to Slack.
export default new Service("slack");
