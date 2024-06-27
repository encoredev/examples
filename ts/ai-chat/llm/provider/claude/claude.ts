import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import Anthropic from '@anthropic-ai/sdk';
import {LLMMessage, Meta, ResponseBuilder} from "../provider";
import {botEventTopic} from "../../llm/topics";
import log from "encore.dev/log";

const claudeKey = secret("ClaudeKey")
const client = new Anthropic({
  apiKey: claudeKey(),
})
const model = "claude-3-5-sonnet-20240620"

export const available = api(
  {expose:false, path:"/claude/available", method:"GET"},
  async function ():Promise<{ available:boolean }> {
       return {available: !!claudeKey()};
  }
)

// chat is the main function to interact with the OpenAI chat model
export const chat = api(
  {expose:false, path:"/claude/chat", method:"POST"},
  async function ({system, messages, meta}:{system:string, messages:LLMMessage[], meta:Meta}):Promise<void> {
    const builder = new ResponseBuilder(meta, msg => {
      return botEventTopic.publish(msg)
    })
    if(messages.length > 0 && messages[0].role === "assistant") {
      // Claude requires a user message to start the conversation
      messages.unshift({role:"user", content:"continue conversation"})
    }
    const stream = await client.messages.create({
      messages: messages,
      model: model,
      max_tokens: 1024,
      stream:true,
      system: system,
    })
    for await (const event of stream) {
      log.debug("claude event", {event: event})
      switch (event.type) {
        case "message_start":
          await builder.parse(flattenContent(event.message.content))
          break;
        case "content_block_start":
          if (event.content_block.type === "text") {
            await builder.parse(event.content_block.text)
          }
          break;
        case "content_block_delta":
          if (event.delta.type === "text_delta") {
            await builder.parse(event.delta.text)
          }
      }
    }
    await builder.parse("\n")
  }
)

// ask is used for one-off questions to the OpenAI model
export const ask = api(
  {expose:false, path:"/claude/ask", method:"POST"},
  async function ({prompt}:{prompt:string}):Promise<{response:string}> {
    const chatCompletion = await client.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: model,
      max_tokens: 4096,
    });
    const response = flattenContent(chatCompletion.content)
    if(!response) {
      return Promise.reject("no response")
    }
    return {response};
  }
)

const flattenContent = (content:Anthropic.ContentBlock[]):string => {
  return content.reduce((acc, content) => {
    if(content.type === "text") {
      acc += content.text;
    }
    return acc;
  }, "")
}