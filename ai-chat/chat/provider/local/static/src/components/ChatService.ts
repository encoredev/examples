// This IChatService implementation is only an example and has no real business value.
// However, this is good start point to make your own implementation.
// Using this service it's possible to connects two or more chats in the same application for a demonstration purposes

import {
  Conversation,
  ConversationId,
  IChatService,
  MessageStatus,
  Participant,
  Presence,
  User,
  UserConnectedEvent,
  UserStatus,
} from "@chatscope/use-chat";
import {
  ChatEventType,
  MessageContentType,
  MessageDirection,
} from "@chatscope/use-chat/dist/enums";
import ReconnectingWebSocket from "reconnecting-websocket";
import {
  ChatEventHandler,
  SendMessageServiceParams,
  SendTypingServiceParams,
  UpdateState,
} from "@chatscope/use-chat/dist/Types";
import { IStorage } from "@chatscope/use-chat/dist/interfaces";
import {
  ChatEvent,
  MessageEvent,
  UserTypingEvent,
} from "@chatscope/use-chat/dist/events";
import { ChatMessage } from "@chatscope/use-chat/dist/ChatMessage";

type EventHandlers = {
  onMessage: ChatEventHandler<
    ChatEventType.Message,
    ChatEvent<ChatEventType.Message>
  >;
  onConnectionStateChanged: ChatEventHandler<
    ChatEventType.ConnectionStateChanged,
    ChatEvent<ChatEventType.ConnectionStateChanged>
  >;
  onUserConnected: ChatEventHandler<
    ChatEventType.UserConnected,
    ChatEvent<ChatEventType.UserConnected>
  >;
  onUserDisconnected: ChatEventHandler<
    ChatEventType.UserDisconnected,
    ChatEvent<ChatEventType.UserDisconnected>
  >;
  onUserPresenceChanged: ChatEventHandler<
    ChatEventType.UserPresenceChanged,
    ChatEvent<ChatEventType.UserPresenceChanged>
  >;
  onUserTyping: ChatEventHandler<
    ChatEventType.UserTyping,
    ChatEvent<ChatEventType.UserTyping>
  >;
  [key: string]: any;
};

interface ServiceMessage {
  id: string;
  type: string;
  userId: string;
  conversationId: ConversationId;
  username: string;
  content: string;
  avatar: string;
}

export class ExampleChatService implements IChatService {
  storage?: IStorage;
  updateState: UpdateState;
  ws: ReconnectingWebSocket;
  user: User;
  reconnect: boolean = false;

  eventHandlers: EventHandlers = {
    onMessage: () => {},
    onConnectionStateChanged: () => {},
    onUserConnected: () => {},
    onUserDisconnected: () => {},
    onUserPresenceChanged: () => {},
    onUserTyping: () => {},
  };

  constructor(storage: IStorage, update: UpdateState, user: User) {
    this.storage = storage;
    this.updateState = update;
    this.user = user;
    let proto = document.location.protocol === "https:" ? "wss://" : "ws://";
    let host = import.meta.env.DEV ? "localhost:4000" : document.location.host;
    this.ws = new ReconnectingWebSocket(proto + host + `/localchat/subscribe`);

    this.ws.addEventListener("open", () => {
      if (!this.reconnect) {
        return;
      }
      this.ws.send(
        JSON.stringify({
          type: "reconnect",
          conversations: this.storage
            ?.getState()
            .conversations.map((conversation: Conversation) => {
              return {
                id: conversation.id,
                lastMessageId: this.storage
                  ?.getState()
                  .messages[conversation.id].at(-1)?.id,
              };
            }),
          userId: user.id,
        }),
      );
    });
    this.ws.addEventListener("close", () => {
      this.reconnect = true;
    });
    this.ws.addEventListener("message", (event) => {
      let msg: ServiceMessage;
      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        console.error("Invalid message", event.data);
        return;
      }
      if (msg.type === "leave") {
        this.storage?.removeParticipant(msg.conversationId, msg.userId);
      } else if (msg.type === "join") {
        if (msg.userId === user.id) {
          return;
        }
        this.storage?.addUser(
          new User({
            id: msg.userId,
            presence: new Presence({
              status: UserStatus.Available,
              description: "",
            }),
            firstName: "",
            lastName: "",
            username: msg.username,
            email: "",
            avatar: msg.avatar,
            bio: msg.content,
          }),
        );
        this.storage?.addParticipant(
          msg.conversationId,
          new Participant({
            id: msg.userId,
          }),
        );
        this.eventHandlers.onUserConnected(new UserConnectedEvent(msg.userId));
      } else if (msg.type === "message") {
        let message = new ChatMessage<MessageContentType.TextPlain>({
          id: msg.id,
          // @ts-ignore
          content: msg.content,
          contentType: MessageContentType.TextPlain,
          senderId: msg.userId,
          direction:
            msg.userId === user.id
              ? MessageDirection.Outgoing
              : MessageDirection.Incoming,
          status: MessageStatus.Pending,
        });
        const conversationId = msg.conversationId;
        if (this.eventHandlers.onMessage) {
          this.eventHandlers.onMessage(
            new MessageEvent({ message, conversationId }),
          );
        }
      } else if (msg.type === "typing") {
        const { userId, conversationId, content } = msg;

        if (this.eventHandlers.onUserTyping) {
          // Running the onUserTyping callback registered by ChatProvider will cause:
          // 1. Add the user to the list of users who are typing in the conversation
          // 2. Debounce
          // 3. Re-render
          this.eventHandlers.onUserTyping(
            new UserTypingEvent({
              userId,
              conversationId,
              content,
              isTyping: true,
            }),
          );
        }
      }
    });
  }

  joinChannel(conversationID: ConversationId) {
    this.ws.send(
      JSON.stringify({
        userId: this.user.id,
        type: "join",
        username: this.user.id,
        conversationId: conversationID,
      }),
    );
  }

  sendMessage({ message, conversationId }: SendMessageServiceParams) {
    if (message.contentType == MessageContentType.TextHtml) {
      const msg = message as ChatMessage<MessageContentType.TextHtml>;
      this.ws.send(
        JSON.stringify({
          id: msg.id,
          type: "message",
          content: msg.content?.toString(),
          userId: msg.senderId,
          conversationId: conversationId,
        }),
      );
    }
  }

  sendTyping({
    isTyping,
    content,
    conversationId,
    userId,
  }: SendTypingServiceParams) {
    if (isTyping) {
      this.ws.send(
        JSON.stringify({
          type: "typing",
          content: content,
          userId: userId,
          conversationId: conversationId,
        }),
      );
    }
  }

  // The ChatProvider registers callbacks with the service.
  // These callbacks are necessary to notify the provider of the changes.
  // For example, when your service receives a message, you need to run an onMessage callback,
  // because the provider must know that the new message arrived.
  // Here you need to implement callback registration in your service.
  // You can do it in any way you like. It's important that you will have access to it elsewhere in the service.
  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>,
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;

    if (key in this.eventHandlers) {
      this.eventHandlers[key] = evtHandler;
    }
  }

  // The ChatProvider can unregister the callback.
  // In this case remove it from your service to keep it clean.
  off<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    _: ChatEventHandler<T, H>,
  ) {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key] = () => {};
    }
  }
}
