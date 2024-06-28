import { BotInfo } from "../../bot/bot";
import { ChatType } from "../service/clients";

export interface SendMessageRequest {
  text: string;
  bot: BotInfo;
}

export interface ProviderChannel {
  name: string;
  provider: ChatType;
  providerID: string;
}

export interface ProviderUser {
  name: string;
  provider: ChatType;
  providerID: string;
  botID?: number;
}

export interface ProviderMessage {
  provider: ChatType;
  providerID: string;
  channelID: string;
  user: ProviderUser;
  text: string;
  time: number;
}
