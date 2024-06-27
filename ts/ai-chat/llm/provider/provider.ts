import {TaskType} from "../llm/llm";
import log from "encore.dev/log";
import {sleep} from "openai/core";
import {BotEvent} from "../llm/topics";

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Meta {
  botIDs: number[];
  channel:number;
  type:TaskType;
}

// The response builder is a helper class to generate formated responses from raw LLM output
export class ResponseBuilder {
  private lineBuffer: string[] = []
  private meta : Meta
  private publisher: (msg:BotEvent) => Promise<string>

  constructor(meta: Meta, publisher: (msg:BotEvent) => Promise<string>) {
    this.meta = meta
    this.publisher = publisher
  }

  public async parse(content:string) {
    if (!content) {
      return
    }
    // LLMs are instructed to respond with one bot message per line
    // split the content into lines and process each line individually
    let lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (i === lines.length - 1) {
        this.lineBuffer.push(line)
        continue;
      }
      if (this.lineBuffer.length > 0) {
        line = this.lineBuffer.join("") + line
        this.lineBuffer = []
      }
      await this.processLine(line)
    }
  }

  private async processLine(line: string) {
    line = line.trim();
    // We don't need to process markup lines
    if(line === "```") {
      return
    }
    log.info("received line", {line:line})
    // split by first colon and try to parse the author and content
    let [author, content] = line.split(":", 2)
    if(!author || !content) {
      return
    }
    const authorID = author.split("/").at(-1)?.toLowerCase();
    if (!authorID ||  authorID === "none") {
      return
    }
    const botIx = parseInt(authorID)
    if(Number.isNaN(botIx) || botIx >= Object.keys(this.meta.botIDs).length || botIx < 0) {
      return
    }
    const bot = this.meta.botIDs[botIx]

    // simulate reading
    await sleep(1000)

    await this.publisher({
      kind: "typing",
      botID: bot,
      channel: this.meta.channel,
      task: this.meta.type,
    })

    // simulate typing
    await sleep(1000)

    // unescape the content by parsing the line as JSON
    try {
      // LLM occassionally forgets to add a trailing quote to the content
      content = content.endsWith('"') ? content : content + '"'
      content = JSON.parse(content)
    } catch (e) {
      log.warn("failed to parse content", {content})
    }

    // Publish the message back to the chat svc
    await this.publisher({
      kind: "message",
      channel: this.meta.channel,
      botID: bot,
      message: content,
      task: this.meta.type,
    })
  }
}