import {
  SQLDatabase
} from "encore.dev/storage/sqldb";
import {api} from "encore.dev/api";
import {Subscription} from "encore.dev/pubsub";
import knex from "knex";
import {bot as botsvc} from "~encore/clients";
import {Bot} from "../../bot/bot";
import {ProviderMessage} from "../provider/provider";
import {llmTasks} from "../../llm/llm/topics";
import {botEventTopic, BotEvent} from "../../llm/llm/topics";
import {providerMessageTopic} from "./topics";
import {availableClients, ChatType} from "./clients";
import {LLMType as LLMClientType} from "../../llm/llm/clients";

export interface Message {
  id: number;
  provider_id: string;
  channel_id: number;
  author_id: number;
  content: string;
  timestamp: number;
  deleted: boolean;
}

export interface User {
  id: number;
  provider : ChatType;
  provider_id: string;
  name: string;
  bot_id?: number;
}

export interface BotChannel {
  channel_id: number;
  bot_id: number;
  deleted: boolean;
}

export interface Channel {
  id: number;
  provider_id: string;
  provider: ChatType,
  name: string;
  deleted: boolean;
}

// This function returns a channel by its id.
export const getChannel = api(
  {expose: false, method: "GET", path: "/channels/:id"},
  async ({id}: {id: number}): Promise<Channel> => {
    const channel = await Channels().where("id", id).first();
    return channel ?? Promise.reject(new Error("channel not found"));
  },
);

// This function returns a channel by its provider id.
export const getChannelByProviderID = api(
  {expose: false, method: "GET", path: "/chat/provider/:provider/channels/:id"},
  async ({id, provider}: {id: string, provider: string}): Promise<Channel> => {
    const channel = await Channels().where("provider_id", id).where("provider", provider).first();
    return channel ?? Promise.reject(new Error("channel not found"));
  },
);

// This function returns all the channels.
export const getChannels = api(
  {expose: false, method: "GET", path: "/channels"},
  async (): Promise<{channels:Channel[]}> => {
    const channels = await Channels().where("deleted", false);
    return {channels};
  },
);

// This endpoint adds a bot to a provider channel. It'll lookup and insert the channel if it doesn't exist. It'll
// also load the channel history and generate a bot introduction message through the LLM service.
export const addBotToProviderChannel = api(
  {expose: false, method: "POST", path: "/chat/provider/:providerID/channels/:channelID/bot/:botID"},
  async ({channelID, botID, providerID}: {channelID: string, botID: number, providerID: string}): Promise<void> => {
    const bot = await botsvc.get({id: botID});
    if (!bot) {
      return Promise.reject(new Error("bot not found"));
    }
    let channel = await getChannelByProviderID({id: channelID, provider: providerID}).catch(() => {});
    const chatsvc = availableClients[providerID as ChatType];
    if(!chatsvc) {
      return Promise.reject(new Error("provider not available"));
    }
    if (!channel) {
      const provChannel = await chatsvc.getChannel({channel:channelID})
      if(!provChannel) {
        return Promise.reject(new Error("channel not found"));
      }
      [channel] = await Channels().insert({
        provider_id: provChannel.providerID,
        provider: providerID as ChatType,
        name: provChannel.name,
        deleted: false,
      }).returning("*")
      if(!channel) {
        return Promise.reject(new Error("channel not found"));
      }
    }
    await BotChannels().insert({channel_id: channel.id, bot_id: botID}).onConflict(["channel_id", "bot_id"]).ignore();
    await chatsvc.joinChannel({channel: channel.provider_id});
    await loadChannelHistory(channel);
    await publishLLMTask("join", channel, [bot]);
  },
);

// This is a helper function to load the channel history. It'll get the last message for a channel from the database
// and then retrieves any new messages from the provider.
export const loadChannelHistory = async (channel: Channel) => {
  const [lastMessage] = await Messages().where("channel_id", channel.id).orderBy("timestamp", "desc").limit(1);
  let chatsvc = availableClients[channel.provider];
  if(!chatsvc) {
    return Promise.reject(new Error("provider not available"));
  }
  const messages = await chatsvc.listMessages({channel: channel.provider_id, oldest: lastMessage});
  if(!messages.messages) {
    return Promise.reject(new Error("no messages found"));
  }
  return insertProviderMessages(channel.provider, messages.messages);
}

// Forwards an incoming message from an LLM bot to a chat provider
export const handleBotEvent = async (event: BotEvent) => {
  const channel = await getChannel({id: event.channel})
  const chatSvc = availableClients[channel.provider];
  if(!chatSvc) {
    return;
  }
  const {info} = (await botsvc.getInfo({id: event.botID}))
  if (!info) {
    return;
  }
  switch (event.kind) {
    case "typing":
      if(!chatSvc.sendTyping) {
        return;
      }
      await chatSvc.sendTyping({channel: channel.provider_id, bot: info});
      break;
    case "message":
      await chatSvc.sendMessage({channel: channel.provider_id, req: {text: event.message!, bot: info}});
      break;
    default:
      const _exhaustiveCheck: never = event;
      break;
  }
}

// stores a message in the database and forwards it to the LLM service for bot responses
export const handleChatMessage = async (message: ProviderMessage) => {
  await insertProviderMessages(message.provider, [message]);
  // if the message is from a bot, we don't want to send it to the LLM service
  // otherwise we might get stuck in a conversation loop
  if(message.user.botID) {
    return
  }
  const channel = await getChannelByProviderID({id: message.channelID, provider: message.provider});
  const channelBots = await BotChannels().select("bot_id").where("channel_id", channel.id);
  if(channelBots.length === 0) {
    return;
  }
  const bots = await botsvc.list({ids: channelBots.map((b) => b.bot_id).join(",")});
  return publishLLMTask("chat", channel, bots.bots)
}

// inserts a list of chat provider messages into the database. It'll create users and channels if they don't exist.
export const insertProviderMessages = async (provider: ChatType, messages: ProviderMessage[]) => {
  const chatsvc = availableClients[provider];
  if(!chatsvc) {
    return Promise.reject(new Error("provider not available"));
  }
  const users = await Users().where("provider", provider);
  const usersByID = new Map(users.map((u) => {
    return [u.provider_id, u];
  }));
  const channels = await Channels().where("provider", provider);
  const channelsByID = new Map(channels.map((c) => {
    return [c.provider_id, c];
  }));
  for (const message of messages) {
    let user = usersByID.get(message.user.providerID);
    if (!user) {
      user = {
        provider: provider,
        provider_id: message.user.providerID,
        name: message.user.name,
        bot_id: message.user.botID,
      } as User;
      if(!user.bot_id) {
        const providerUser = await chatsvc.getUser({userID: message.user.providerID})
        if(providerUser) {
          user.name = providerUser.name;
        }
      }
      [user] = await Users().insert(user).returning("*");
      if(!user) {
        return Promise.reject(new Error("user not found"));
      }
      usersByID.set(user.provider_id, user);
    }
    let channel = channelsByID.get(message.channelID);
    if (!channel) {
      const provChannel = await chatsvc.getChannel({channel: message.channelID});
      [channel] = await Channels().insert({
        provider_id: provChannel.providerID,
        provider: provider,
        name: provChannel.name,
        deleted: false,
      }).returning("*")
      if(!channel) {
        return Promise.reject(new Error("channel not found"));
      }
      channelsByID.set(provChannel.providerID, channel);
    }

    await Messages().insert({
      provider_id: message.providerID,
      channel_id: channel.id,
      author_id: user.id,
      content: message.text,
      timestamp: message.time,
      deleted: false,
    });
  }
}

type LLMTaskType = "chat" | "join" | "leave"

// publishes an async task to the LLM service via a Pub/Sub topic.
const publishLLMTask = async (type:LLMTaskType, channel: Channel, bots: Bot[]) => {
  const messages = await Messages().where("channel_id", channel.id).orderBy("timestamp", "desc").limit(25).then((m) => m.reverse());
  const users = await Users().where("id", "in",
    Messages().distinct("author_id").where("channel_id", channel.id));

  // Send one task per LLM provider
  const botsByProvider = groupBy(bots, (b) => b.provider);
  for await (const [provider, bots] of Object.entries(botsByProvider)) {
    await llmTasks.publish({
      bots: bots,
      users: users,
      channel: channel,
      messages: messages,
      type: type,
      provider: provider as LLMClientType,
    })
  }
}

// groupBy is a helper function to group a list of items by a key.
const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);

new Subscription(botEventTopic, "handler", {
  handler: handleBotEvent,
});

new Subscription(providerMessageTopic, "handler", {
  handler: handleChatMessage,
});

const ChatDB = new SQLDatabase("chat", {
  migrations: "./migrations",
});

const orm = knex({
  client: "pg",
  connection: ChatDB.connectionString,
});

const Messages = () => orm<Message>("message");
const Channels = () => orm<Channel>("channel");
const Users = () => orm<User>("user");
const BotChannels = () => orm<BotChannel>("bot_channel");