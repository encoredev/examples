import {
  BasicStorage,
  ChatProvider,
  IStorage,
  Presence,
  UpdateState,
  User,
  UserStatus,
} from "@chatscope/use-chat";
import { ExampleChatService } from "./components/ChatService";
import { Chat } from "./components/Chat";
import { AutoDraft } from "@chatscope/use-chat/dist/enums/AutoDraft";
import { nanoid } from "nanoid";
import { humanId } from "human-id";
import { useSearchParams } from "react-router-dom";

export const EncoreChat = () => {
  const [searchParams] = useSearchParams();
  const channelID = searchParams.get("channel") || humanId();
  const userName = searchParams.get("name") || "User";

  const user = new User({
    id: userName,
    presence: new Presence({ status: UserStatus.Available, description: "" }),
    username: userName,
    avatar: "",
  });

  const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ExampleChatService(storage, updateState, user);
  };

  const storage = new BasicStorage({
    groupIdGenerator: () => nanoid(),
    messageIdGenerator: () => nanoid(),
  });

  return (
    <div className="flex w-full h-dvh">
      <ChatProvider
        serviceFactory={serviceFactory}
        storage={storage}
        config={{
          typingThrottleTime: 250,
          typingDebounceTime: 5000,
          debounceTyping: true,
          autoDraft: AutoDraft.Save | AutoDraft.Restore,
        }}
      >
        <Chat channelID={channelID} user={user} />
      </ChatProvider>
    </div>
  );
};
