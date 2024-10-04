import { FC, useContext, useEffect, useState } from "react";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { ClientContext } from "./ClientContext.ts";
import { elevenlabs } from "./client.ts";
import { Play } from "@phosphor-icons/react";
import SlideOver from "./SlideOver.tsx";

const playPreview = (url: string) => {
  const a = new Audio(url);
  a.play();
};

const VoicesPanel: FC<{
  show: boolean;
  setShow: (val: boolean) => void;
  setVoice: (voice: elevenlabs.Voice) => void;
}> = ({ setShow, show, setVoice }) => {
  const client = useContext(ClientContext);
  const [voices, setVoices] = useState<elevenlabs.Voice[]>([]);

  useEffect(() => {
    const fn = async () => {
      await client.elevenlabs
        .getVoices()
        .then((response) => {
          setVoices(response.voices);
          setVoice(response.voices[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fn();
  }, []);

  return (
    <SlideOver show={show} setShow={setShow}>
      <DialogPanel className="pointer-events-auto w-screen max-w-md">
        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
          <div className="sticky top-0 z-10 bg-black px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold leading-6 text-white">
                Voice selection
              </DialogTitle>
            </div>
            <div className="mt-1">
              <p className="text-sm text-white text-opacity-70">
                Pick from a selection of pre-defined voices.
              </p>
            </div>
          </div>
          <div className="relative flex-1 px-4 py-6 sm:px-3">
            <ul className="space-y-2">
              {voices.map((voice) => {
                const labelValues = Object.values(voice.labels) as string[];
                return (
                  <li
                    key={voice.id}
                    className="flex flex-col hover:bg-black hover:bg-opacity-5 py-2 px-3 cursor-pointer"
                    onClick={() => {
                      setVoice(voice);
                      setShow(false);
                    }}
                  >
                    <div className="flex space-x-2 items-center">
                      <div
                        className="rounded-full flex items-center justify-center bg-black h-5 w-5 cursor-pointer transition hover:scale-[1.2]"
                        onClick={(event) => {
                          event.stopPropagation();
                          playPreview(voice.preview_url);
                        }}
                      >
                        <Play color="white" size="11" weight="fill" />
                      </div>
                      <p className="font-semibold">{voice.name}</p>
                    </div>
                    <div className="space-x-2">
                      {labelValues.map((label) => {
                        return (
                          <span key={label} className="text-sm opacity-70">
                            {label}
                          </span>
                        );
                      })}
                    </div>
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

export default VoicesPanel;
