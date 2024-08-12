import {api} from "encore.dev/api";
import {book} from "~encore/clients";
import OpenAI from "openai";
import {secret} from "encore.dev/config";
import log from "encore.dev/log";

// Setting secrets docs: https://encore.dev/docs/ts/primitives/secrets
const apiKey = secret("OpenAIAPIKey");

const openai = new OpenAI({
  apiKey: apiKey(),
});

/**
 * Uses GPT model to answer questions about books using the endpoints in the books service.
 *
 * Prompt examples:
 * - Recommend me a book that is similar to Kill a Mockingbird
 * - Give me the book with the id of a1
 * - List all historical books
 * - What is the book The Girl with the Dragon Tattoo about
 */
export const gpt = api(
  {expose: true, method: "GET", path: "/gpt"},
  async ({prompt}: { prompt: string }): Promise<{ message: string | null }> => {
    const runner = openai.beta.chat.completions
      .runTools({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Please use our book database, which you can access using functions to answer the following questions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "list",
              // Setting `strict` to true enables Structured Outputs which ensures model outputs will exactly match your supplied schema.
              // More info here: https://platform.openai.com/docs/guides/function-calling
              strict: true,
              description:
                "list queries books by genre, and returns a list of names of books",
              parameters: {
                type: "object",
                properties: {
                  genre: {
                    type: "string",
                    enum: [
                      "mystery",
                      "nonfiction",
                      "memoir",
                      "romance",
                      "historical",
                    ],
                  },
                },
                additionalProperties: false,
                required: ["genre"],
              },
              function: async (args: { genre: string }) =>
                await book.list(args),
              parse: JSON.parse,
            },
          },
          {
            type: "function",
            function: {
              name: "search",
              strict: true,
              description:
                "search queries books by their name and returns a list of book names and their ids",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
                additionalProperties: false,
                required: ["name"],
              },
              function: (args: { name: string }) => book.search(args),
              parse: JSON.parse,
            },
          },
          {
            type: "function",
            function: {
              name: "get",
              strict: true,
              description:
                "get returns a book's detailed information based on the id of the book. Note that this does not accept names, and only IDs, which you can get by using search.",
              parameters: {
                type: "object",
                properties: {
                  id: { type: "string" },
                },
                additionalProperties: false,
                required: ["id"],
              },
              function: (args: { id: string }) => book.get(args),
              parse: JSON.parse,
            },
          },
        ],
      })
      .on("message", (msg) => console.log(msg))
      .on("content", (diff) => process.stdout.write(diff));

    const result = await runner.finalChatCompletion();
    const message = result.choices[0].message.content;

    runner.messages.forEach(msg => {
      log.info(`GPT ${msg.role} message`, msg);
    });

    return {message};
  },
);
