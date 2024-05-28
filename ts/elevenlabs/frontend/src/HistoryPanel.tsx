import { FC, useContext, useEffect, useState } from "react";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { ClientContext } from "./ClientContext.ts";
import { elevenlabs } from "./client.ts";
import { DownloadSimple, Play } from "@phosphor-icons/react";
import SlideOver from "./SlideOver.tsx";

const HistoryPanel: FC<{
  show: boolean;
  setShow: (val: boolean) => void;
}> = ({ setShow, show }) => {
  const client = useContext(ClientContext);
  const [history, setHistory] = useState<elevenlabs.History[]>([]);

  const playItem = async (id: string) => {
    const context = new AudioContext();
    const resp = await client.elevenlabs.getHistoryItemAudio("GET", id);
    const audioBuffer = await context.decodeAudioData(await resp.arrayBuffer());
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
  };

  const downloadItem = async (id: string) => {
    const resp = await client.elevenlabs.getHistoryItemAudio("GET", id);
    const blob = new Blob([await resp.arrayBuffer()], { type: "audio/mpeg" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = id + ".mp3";
    a.click();
  };

  useEffect(() => {
    const fn = async () => {
      await client.elevenlabs
        .getHistory()
        .then((response) => {
          setHistory(response.history);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fn();
  }, [show]);

  return (
    <SlideOver show={show} setShow={setShow}>
      <DialogPanel className="pointer-events-auto w-screen max-w-md">
        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
          <div className="sticky top-0 z-10 bg-black px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold leading-6 text-white">
                Speech Synthesis History
              </DialogTitle>
            </div>
            <div className="mt-1">
              <p className="text-sm text-white text-opacity-70">
                Play or download previously generated items.
              </p>
            </div>
          </div>
          <div className="relative flex-1 px-4 py-6 sm:px-3">
            <ul className="space-y-2">
              {history.map((h) => {
                return (
                  <li
                    key={h.history_item_id}
                    className="flex flex-col py-2 px-3"
                  >
                    <div className="flex space-x-2 items-center">
                      <div
                        className="rounded-full flex items-center justify-center bg-black h-5 w-5 cursor-pointer transition hover:scale-[1.2]"
                        onClick={(event) => {
                          event.stopPropagation();
                          playItem(h.history_item_id);
                        }}
                      >
                        <Play color="white" size="11" weight="fill" />
                      </div>
                      <div
                        className="rounded-full flex items-center justify-center border border-black h-5 w-5 cursor-pointer transition hover:scale-[1.2]"
                        onClick={(event) => {
                          event.stopPropagation();
                          downloadItem(h.history_item_id);
                        }}
                      >
                        <DownloadSimple size="14" weight="bold" />
                      </div>
                      <p className="font-semibold">{h.voice_name}</p>
                    </div>
                    <div className="text-sm opacity-70">{h.text}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </DialogPanel>
    </SlideOver>
  );
};

export default HistoryPanel;
