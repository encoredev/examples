import { FC, useEffect, useState } from "react";
import {
  DialogTitle,
  Field,
  Select,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import Modal, { ModalProps } from "./Modal.tsx";
import Button from "./Button.tsx";
import Client, { Local, local } from "../client.ts";
import { CaretDown } from "@phosphor-icons/react";

export interface AddBotStatus {
  botName: string;
  status: "success" | "failure" | "creating" | "inviting";
}

const apiURL = import.meta.env.DEV
  ? Local
  : window.location.protocol + "//" + window.location.host;

const client = new Client(apiURL);

const AddBotModal: FC<
  ModalProps & {
    channelID: string;
    statusChange: (s?: AddBotStatus) => void;
  }
> = ({ channelID, statusChange, show, onHide }) => {
  const [bots, setBots] = useState<local.BotInfo[]>([]);
  const [selectedBot, setSelectedBot] = useState<local.BotInfo | undefined>();
  const [selectedBotProfile, setSelectedBotProfile] = useState<
    string | undefined
  >();
  const [botName, setBotName] = useState("");
  const [botPrompt, setBotPrompt] = useState("");
  const disableButton = !botName || !botPrompt;

  const addToChannel = async (botID: string) => {
    client.chat
      .AddBotToProviderChannel("localchat", channelID, botID)
      .then(() => {
        if (statusChange) statusChange();
      })
      .catch(() => {
        if (statusChange) statusChange({ botName: botName, status: "failure" });
      });
  };

  const inviteBot = async () => {
    if (!selectedBot) return;
    if (statusChange)
      statusChange({ botName: selectedBot.name, status: "inviting" });
    addToChannel(selectedBot.id);
    onHide();
  };

  const createBot = async () => {
    if (statusChange) statusChange({ botName: botName, status: "creating" });
    onHide();

    client.bot
      .Create({
        name: botName,
        prompt: botPrompt,
        llm: "openai",
      })
      .then((resp) => {
        addToChannel(resp.ID);
      })
      .catch(() => {
        if (statusChange) statusChange({ botName: botName, status: "failure" });
      });
  };

  useEffect(() => {
    client.local
      .ListBots()
      .then((resp) => {
        // Put newly created bots first
        const reversed = resp.bots.reverse();
        setBots(reversed);
        setSelectedBot(reversed[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [show]);

  useEffect(() => {
    if (!selectedBot) return;
    client.bot
      .Get(selectedBot.id)
      .then((resp) => {
        setSelectedBotProfile(resp.Profile);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selectedBot]);

  useEffect(() => {
    if (show) {
      setBotName("");
      setBotPrompt("");
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="text-white">
        <DialogTitle className="font-bold text-xl mb-4">Add Bot</DialogTitle>

        <TabGroup>
          <div className="border-b border-gray-500">
            <TabList className="-mb-px flex space-x-8">
              <Tab>
                {({ selected }) => (
                  <span
                    className={classNames(
                      selected
                        ? "border-white text-white"
                        : "border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-400",
                      "whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium block",
                    )}
                  >
                    Invite bot
                  </span>
                )}
              </Tab>
              <Tab>
                {({ selected }) => (
                  <span
                    className={classNames(
                      selected
                        ? "border-white text-white"
                        : "border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-400",
                      "whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium block",
                    )}
                  >
                    Create bot
                  </span>
                )}
              </Tab>
            </TabList>
          </div>

          <TabPanels className="mt-3">
            <TabPanel>
              <Field>
                <div className="relative">
                  <Select
                    className={classNames(
                      "block w-full appearance-none rounded border-none bg-white/5 py-1.5 px-3 text-white",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                      // Make the text of each option black on Windows
                      "*:text-black",
                    )}
                    onChange={(e) =>
                      setSelectedBot(bots[parseInt(e.target.value)])
                    }
                  >
                    {bots.map((bot, index) => (
                      <option key={bot.id} value={index}>
                        {bot.name}
                      </option>
                    ))}
                  </Select>
                  <CaretDown
                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                    aria-hidden="true"
                  />
                </div>
              </Field>

              <div className="mt-4 grid-cols-2 gap-4 hidden md:grid">
                <img src={selectedBot?.avatar} className="w-full rounded-md" />
                <p className="text-sm">{selectedBotProfile}</p>
              </div>

              <div className="mt-4 block md:hidden">
                <p className="text-sm">
                  <img
                    src={selectedBot?.avatar}
                    className="w-1/2 rounded-md float-left mr-4 mb-2"
                  />
                  {selectedBotProfile}
                </p>
              </div>

              <div className="flex space-x-4 justify-end mt-6">
                <Button size="sm" mode="light" onClick={inviteBot}>
                  Invite
                </Button>
              </div>
            </TabPanel>

            <TabPanel>
              <label className="flex flex-col">
                <span className="text-gray-400 text-sm font-semibold leading-6">
                  Name
                </span>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-500 bg-gray-700 focus:ring-0 focus:border-gray-500"
                  placeholder="Adam"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </label>

              <label className="flex flex-col mt-4">
                <span className="text-gray-400 text-sm font-semibold leading-6">
                  Bot Description
                </span>
                <textarea
                  rows={3}
                  className="w-full rounded-md border-gray-500 bg-gray-700 focus:ring-0 focus:border-gray-500"
                  placeholder="A depressed accountant"
                  value={botPrompt}
                  onChange={(e) => setBotPrompt(e.target.value)}
                />
              </label>

              <div className="flex space-x-4 justify-end mt-6">
                <Button
                  size="sm"
                  mode="light"
                  disabled={disableButton}
                  onClick={createBot}
                >
                  Create
                </Button>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </Modal>
  );
};

export default AddBotModal;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
