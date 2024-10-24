import { describe, expect, test } from "vitest";
import { chat } from "~encore/clients";

describe("chat", () => {
  test("should get back own message with correct parameters", async () => {
    // Connect to the chat server
    const stream = await chat.chat({ id: "user-id" });

    // Send a message to the server
    await stream.send({ username: "foo", msg: "hello" });

    // Receive a message from the server
    const { msg, userID, username } = await stream.recv();
    expect(userID).toBe("user-id");
    expect(msg).toBe("hello");
    expect(username).toBe("foo");
  });

  test("should get other users message", async () => {
    // Connect clients to the chat server
    const stream1 = await chat.chat({ id: "user-1" });
    const stream2 = await chat.chat({ id: "user-2" });
    const stream3 = await chat.chat({ id: "user-3" });

    // Send a message from one client
    await stream1.send({ username: "foo", msg: "hello" });

    // Receive the message from the other clients
    const stream2Results = await stream2.recv();
    const stream3Results = await stream3.recv();

    expect(stream2Results.userID).toBe("user-1");
    expect(stream3Results.userID).toBe("user-1");
  });
});
