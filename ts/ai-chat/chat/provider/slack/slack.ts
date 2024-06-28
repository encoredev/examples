import { api } from "encore.dev/api";
import log from "encore.dev/log";
import { secret } from "encore.dev/config";
import { WebClient } from "@slack/web-api";
import {
  ProviderChannel,
  ProviderMessage,
  ProviderUser,
  SendMessageRequest,
} from "../provider";
import { Message } from "../../service/chat";
import { providerMessageTopic } from "../../service/topics";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";
import { getJSONBody } from "../../../utils/utils";

// We use Encore secrets to store the Slack token
const slackToken = secret("SlackToken");
const client = new WebClient(slackToken());

// available checks if the slack token is set
export const available = api(
  { expose: false, method: "GET", path: "/slack/available" },
  async (): Promise<{ available: boolean }> => {
    return { available: !!slackToken() };
  },
);

// sendMessage sends a message to a slack channel
export const sendMessage = api(
  { expose: false, method: "POST", path: "/slack/channel/:channel/message" },
  async ({
    channel,
    req,
  }: {
    channel: string;
    req: SendMessageRequest;
  }): Promise<void> => {
    log.info("Sending message to slack", { channel, req });
    return client.chat
      .postMessage({
        channel,
        text: req.text,
        username: req.bot.name,
        icon_url: req.bot.avatar,
        metadata: {
          event_type: "bot_message",
          event_payload: {
            bot_id: req.bot.id,
          },
        },
      })
      .then(() => {});
  },
);

// listChannels lists all the channels in the slack workspace
export const listChannels = api(
  { expose: false, method: "GET", path: "/slack/channel" },
  async (): Promise<{ channels: ProviderChannel[] }> => {
    return client.conversations
      .list({
        types: "public_channel,private_channel",
        limit: 1000,
      })
      .then((channels) => {
        return {
          channels: (channels.channels || []).map((c) => {
            return {
              name: c.name || "",
              provider: "slack",
              providerID: c.id || "",
            };
          }),
        };
      });
  },
);

// getUser gets a user or a bot by their ID
export const getUser = api(
  { expose: false, method: "GET", path: "/slack/user/:userID" },
  async ({ userID }: { userID: string }): Promise<ProviderUser> => {
    if (userID.startsWith("B")) {
      const [botID, name] = userID.split(":", 2);
      if (name) {
        return {
          name: name,
          provider: "slack",
          providerID: botID,
        };
      }
      return client.bots.info({ bot: botID }).then((resp) => {
        return {
          name: resp.bot?.name || "",
          provider: "slack",
          providerID: botID,
        };
      });
    }
    return client.users.info({ user: userID }).then((resp) => {
      return {
        name: resp.user?.profile?.display_name || "",
        provider: "slack",
        providerID: resp.user?.id || "",
      };
    });
  },
);

// joinChannel joins a channel
export const joinChannel = api(
  { expose: false, method: "POST", path: "/slack/channel/:channel/join" },
  async ({ channel }: { channel: string }): Promise<void> => {
    return client.conversations.join({ channel }).then(() => {});
  },
);

// leaveChannel leaves a channel
export const leaveChannel = api(
  { expose: false, method: "POST", path: "/slack/channel/:channel/leave" },
  async ({ channel }: { channel: string }): Promise<void> => {
    return client.conversations.leave({ channel }).then(() => {});
  },
);

// toProviderMessage converts a slack message to a ProviderMessage
const toProviderMessage = (
  msg: MessageElement,
  channel: string,
): ProviderMessage | null => {
  if (
    msg.text === "" ||
    msg.type !== "message" ||
    !["", "bot_message"].includes(msg.subtype || "")
  ) {
    return null;
  }
  log.info("Converting message", { msg });
  const author: ProviderUser = {
    name: msg.username || "",
    provider: "slack",
    providerID: msg.user || "",
  };
  if (msg.subtype === "bot_message") {
    author.providerID = msg.bot_id + ":" + msg.username;
    if (msg.metadata?.event_type === "bot_message") {
      const payload = msg.metadata.event_payload as
        | { bot_id: number }
        | undefined;
      author.botID = payload?.bot_id;
    }
  }
  return {
    provider: "slack",
    providerID: msg.ts || "",
    channelID: channel,
    user: author,
    text: msg.text || "",
    time: parseFloat(msg.ts || "0") * 1000,
  };
};

// listMessages lists messages in a channel
export const listMessages = api(
  { expose: false, method: "POST", path: "/slack/channel/:channel/messages" },
  async ({
    channel,
    oldest,
  }: {
    channel: string;
    oldest?: Message;
  }): Promise<{ messages?: ProviderMessage[] }> => {
    const oldestTs = oldest ? oldest.timestamp / 1000 : undefined;
    log.debug("Listing messages", { channel, oldestTs });
    return client.conversations
      .history({ channel, oldest: oldestTs?.toString() })
      .then((resp) => {
        return {
          messages: resp.messages
            ?.map((m) => {
              return toProviderMessage(m, channel);
            })
            .filter((m) => m !== null) as ProviderMessage[],
        };
      });
  },
);

// slackWebhook is a webhook that listens for slack events. It's configured in the slack app settings
export const slackWebhook = api.raw(
  { expose: true, method: "POST", path: "/slack/webhook" },
  async (req, resp) => {
    if (!(await available())) {
      return resp.writeHead(404).end("Not found");
    }
    const body = await getJSONBody<{
      type: string;
      challenge?: string;
      event?: MessageElement & { channel: string };
    }>(req);
    switch (body.type) {
      case "url_verification":
        resp.setHeader("Content-Type", "text/plain");
        resp.end(body.challenge);
        return;
      case "event_callback":
        const msg = toProviderMessage(body.event!, body.event!.channel);
        if (!msg) {
          return;
        }
        await providerMessageTopic.publish(msg);
    }
    resp.end("ok");
  },
);

// getChannel gets a channel by its ID
export const getChannel = api(
  { expose: false, method: "GET", path: "/slack/channel/:channel" },
  async ({ channel }: { channel: string }): Promise<ProviderChannel> => {
    return client.conversations.info({ channel }).then((resp) => {
      return {
        name: resp.channel?.name || "",
        provider: "slack",
        providerID: resp.channel?.id || "",
      };
    });
  },
);
