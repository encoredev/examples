import { Topic } from "encore.dev/pubsub";
import { TaskType } from "./llm";
import { Bot } from "../../bot/bot";
import { Channel, Message, User } from "../../chat/service/chat";
import { LLMType } from "./clients";

export interface BotTyping {
  kind: "typing";
}

export interface BotMessage {
  kind: "message";
  message: string;
}

export type BotEvent = (BotTyping | BotMessage) & {
  botID: number;
  channel: number;
  task: TaskType;
};

export const botEventTopic = new Topic<BotEvent>("llm-response", {
  deliveryGuarantee: "at-least-once",
});

export interface LLMTask {
  bots: Bot[];
  users: User[];
  channel: Channel;
  messages: Message[];
  provider: LLMType;
  type: TaskType;
}

export const llmTasks = new Topic<LLMTask>("llm-tasks", {
  deliveryGuarantee: "at-least-once",
});
