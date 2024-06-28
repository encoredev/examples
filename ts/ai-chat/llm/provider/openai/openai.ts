import OpenAI from "openai";
import { secret } from "encore.dev/config";
import { api } from "encore.dev/api";
import { LLMMessage, Meta, ResponseBuilder } from "../provider";
import { botEventTopic } from "../../service/topics";

const model = "gpt-4o";
const openAIKey = secret("OpenAIKey");
const client = new OpenAI({ apiKey: openAIKey() });

// available checks if the OpenAI provider is configured
export const available = api(
  { expose: false, path: "/openai/available", method: "GET" },
  async function (): Promise<{ available: boolean }> {
    return { available: !!openAIKey() };
  },
);

// chat is the main function to interact with the OpenAI chat model
export const chat = api(
  { expose: false, path: "/openai/chat", method: "POST" },
  async function ({
    system,
    messages,
    meta,
  }: {
    system: string;
    messages: LLMMessage[];
    meta: Meta;
  }): Promise<void> {
    let allMessages: [
      { role: "system" | "user" | "assistant"; content: string },
    ] = [{ role: "system", content: system }];
    allMessages.push(...messages);
    const stream = await client.chat.completions.create({
      messages: allMessages,
      model: model,
      n: 1,
      stream: true,
    });
    const builder = new ResponseBuilder(meta, (msg) => {
      return botEventTopic.publish(msg);
    });
    for await (const completion of stream) {
      const content = completion.choices[0]?.delta?.content || "";
      await builder.parse(content);
    }
    await builder.parse("\n");
  },
);

// ask is used for one-off questions to the OpenAI model
export const ask = api(
  { expose: false, path: "/openai/ask", method: "POST" },
  async function ({
    prompt,
  }: {
    prompt: string;
  }): Promise<{ response: string }> {
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      n: 1,
    });
    const response = chatCompletion.choices.at(0)?.message.content;
    if (!response) {
      return Promise.reject("no response");
    }
    return { response };
  },
);

// generateAvatar is used to generate an avatar image from a prompt
export const generateAvatar = api(
  { expose: false, path: "/openai/image", method: "POST" },
  async function ({ prompt }: { prompt: string }): Promise<{ data: string }> {
    const imageResponse = await client.images.generate({
      prompt: prompt,
      size: "1024x1024",
      model: "dall-e-3",
      n: 1,
      response_format: "b64_json",
    });
    const data = imageResponse.data.at(0)?.b64_json;
    if (!data) {
      return Promise.reject("no image returned");
    }
    return { data };
  },
);
