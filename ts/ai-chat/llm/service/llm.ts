import { api } from "encore.dev/api";
import {
  createPersonaPrompt,
  createAvatar,
  joinPrompt,
  responsePrompt,
  systemPrompt,
  chatPrompt,
} from "./prompts";
import { Subscription } from "encore.dev/pubsub";
import { User } from "../../chat/service/chat";
import { Bot } from "../../bot/bot";
import { LLMMessage } from "../provider/provider";
import sharp from "sharp";
import { availableClients, LLMType } from "./clients";
import { LLMTask, llmTasks } from "./topics";
import log from "encore.dev/log";

// generateBotProfile creates a new bot profile and avatar using the LLM provider.
export const generateBotProfile = api(
  { expose: false, method: "POST", path: "/llm/profile" },
  async ({
    name,
    prompt,
    provider,
  }: {
    name: string;
    prompt: string;
    provider: string;
  }): Promise<{ profile: string; avatar?: string }> => {
    let client = availableClients[provider as LLMType];
    if (!client) {
      throw new Error("Provider not available");
    }
    const profile = await client.ask({
      prompt: createPersonaPrompt
        .replace("{name}", name)
        .replace("{prompt}", prompt),
    });
    if (!client.generateAvatar) {
      return { profile: profile.response };
    }

    let avatar = await client.generateAvatar({
      prompt: createAvatar.replace("{profile}", prompt),
    });
    // we store the avatar in the db, so we resize it to make in managable
    avatar.data = await sharp(Buffer.from(avatar.data, "base64"))
      .resize(100, 100)
      .toBuffer()
      .then((data) => {
        return data.toString("base64");
      });
    return { profile: profile.response, avatar: avatar?.data };
  },
);

// formatTaskPrompt prepares a LLM prompt for a specific task
const formatTaskPrompt = (task: LLMTask): string => {
  let prompt = "Admin: ";
  switch (task.type) {
    case "join":
      prompt += joinPrompt.replace("{channel}", task.channel.name);
      break;
    case "leave":
      prompt += joinPrompt.replace("{channel}", task.channel.name);
      break;
    case "chat":
      prompt += chatPrompt;
      break;
    default:
      const _exhaustiveCheck: never = task.type;
  }
  const bots = task.bots.map((bot) => bot.name).join(", ");
  return prompt + responsePrompt.replace("{bots}", bots);
};

// handleLLMTask is a handler function for the llm-tasks topic. It formats the task and sends it to the LLM provider.
export const handleLLMTask = api(
  { expose: false, method: "POST", path: "/llm/task" },
  async (task: LLMTask): Promise<void> => {
    const llmsvc = availableClients[task.provider];
    if (!llmsvc) {
      throw new Error("Provider not available");
    }
    const usersByID = task.users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<number, User>,
    );
    const botsByID = task.bots.reduce(
      (acc, bot) => {
        acc[bot.id] = bot;
        return acc;
      },
      {} as Record<number, Bot>,
    );

    let botProfiles = task.bots
      .map((bot, i) => `${i}: ${bot.profile}`)
      .join("\n");

    // Add the chat history to the prompt
    const msgs = task.messages.reduce((msgs, msg) => {
      const user = usersByID[msg.author_id];
      const bot = user.bot_id ? botsByID[user.bot_id] : null;
      const name = bot?.name ?? user.name;
      const date = new Date(msg.timestamp);
      const ts = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      const content = `${ts} ${task.channel.name}/${name}: ${msg.content}`;
      const role = bot ? "assistant" : "user";
      log.info("adding message", { role: role, content: content });
      if (msgs.length == 0 || msgs[msgs.length - 1].role !== role) {
        msgs.push({ role: role, content: content });
      } else {
        msgs[msgs.length - 1].content += "\n" + content;
      }
      return msgs;
    }, [] as LLMMessage[]);

    // And finally we add the instruction for what the LLM should do
    if (msgs.length == 0 || msgs[msgs.length - 1].role !== "user") {
      msgs.push({ role: "user", content: formatTaskPrompt(task) });
    } else {
      msgs[msgs.length - 1].content += "\n" + formatTaskPrompt(task);
    }

    await llmsvc.chat({
      system: systemPrompt.replace("{bots}", botProfiles),
      messages: msgs,
      meta: {
        botIDs: task.bots.map((bot) => bot.id),
        channel: task.channel.id,
        type: task.type,
      },
    });
  },
);

export type TaskType = "chat" | "join" | "leave";

const _ = new Subscription(llmTasks, "task-handler", {
  handler: handleLLMTask,
});
