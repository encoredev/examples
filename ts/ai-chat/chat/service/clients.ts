import {
  ProviderChannel,
  ProviderMessage,
  ProviderUser,
  SendMessageRequest,
} from "../provider/provider";
import { slack as slacksvc } from "~encore/clients";
import { Message } from "./chat";
import { BotInfo } from "../../bot/bot";
import { filterObject } from "../../utils/utils";

// the Client interface is used to define the methods that the chat service can call on the chat providers
export interface Client {
  listChannels(): Promise<{ channels: ProviderChannel[] }>;
  getUser(req: { userID: string }): Promise<ProviderUser>;
  joinChannel(req: { channel: string }): Promise<void>;
  leaveChannel(req: { channel: string }): Promise<void>;
  listMessages(req: {
    channel: string;
    oldest?: Message;
  }): Promise<{ messages?: ProviderMessage[] }>;
  getChannel(req: { channel: string }): Promise<ProviderChannel>;
  sendMessage(req: { channel: string; req: SendMessageRequest }): Promise<void>;
  sendTyping?(req: { channel: string; bot: BotInfo }): Promise<void>;
  available(): Promise<{ available: boolean }>;
}

// We need to explicitly call the client functions, instead of just casting the client object to ProviderInterface.
// This is because Encore tracks the usage of the client functions per service, in order to be able to correctly
// configure the service's permissions.
const allClients = {
  slack: {
    sendTyping: (): Promise<void> => {
      return Promise.resolve();
    },
    sendMessage: (...args) => slacksvc.sendMessage(...args),
    listChannels: (...args) => slacksvc.listChannels(...args),
    getUser: (...args) => slacksvc.getUser(...args),
    joinChannel: (...args) => slacksvc.joinChannel(...args),
    leaveChannel: (...args) => slacksvc.leaveChannel(...args),
    listMessages: (...args) => slacksvc.listMessages(...args),
    getChannel: (...args) => slacksvc.getChannel(...args),
    available: () => slacksvc.available(),
  } as Client,
};

export type ChatType = keyof typeof allClients;

// AvailableClients is a map of the clients which responded as available to the available() function.
export let availableClients: Partial<typeof allClients>;

// This function initializes all the supported clients. It's called when the server starts and
// uses the available() function to check if the provider is available.
(async function initClients(): Promise<Partial<typeof allClients>> {
  return filterObject(allClients, ([provider, client]) => {
    return client.available().then(({ available }) => available);
  });
})().then((r) => (availableClients = r));
