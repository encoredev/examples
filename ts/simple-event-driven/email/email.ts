import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { Subscription } from "encore.dev/pubsub";
import { UserAddedTopic } from "../user/user";
import sendGrid from "@sendgrid/mail";

const sendGridAPIKey = secret("SendGridAPIKey");
sendGrid.setApiKey(sendGridAPIKey());

export const send = api(
  { expose: false, method: "POST" },
  async ({ name, email }: {
    name: string;
    email: string;
  }): Promise<void> => {
    const msg = {
      to: email,
      from: "simon@encore.dev",
      subject: `Welcome ${name}!`,
      text: "You are sooo welcome!",
    };

    try {
      await sendGrid.send(msg);
    } catch (error) {
      throw APIError.internal("Failed to send email");
    }
  },
);

const _ = new Subscription(UserAddedTopic, "welcome-email", {
  handler: async (event) => {
    await send(event);
  },
});
