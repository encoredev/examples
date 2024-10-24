import { describe, expect, test } from "vitest";
import { chat } from "~encore/clients";

describe("chat", () => {
  test("should get back message with correct parameters", async () => {
    const stream = await chat.chat({ id: "123" });
    await stream.send({ username: "user", msg: "hello" });
    const { msg, userID, username } = await stream.recv();

    expect(msg).toBe("hello");
    expect(userID).toBe("123");
    expect(username).toBe("user");
  });
});
