import { FC, useEffect, useState } from "react";
import { DialogTitle } from "@headlessui/react";
import Modal, { ModalProps } from "./Modal.tsx";
import { Check, Copy } from "@phosphor-icons/react";

const InviteFriendModal: FC<
  ModalProps & {
    channelID: string;
  }
> = ({ channelID, show, onHide }) => {
  const url = location.origin + `?channel=${channelID}`;
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (show) setHasCopied(false);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="text-white">
        <DialogTitle className="font-bold text-xl mb-4">
          Invite a friend
        </DialogTitle>

        <p className="mb-4 text-sm text-gray-400">
          Send this URL to a friend to let them join the chat:
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <div className="overflow-x-auto overflow-y-hidden border border-white/20 rounded-md w-fit max-w-full">
            <span className="text-xs whitespace-nowrap px-2 py-1">{url}</span>
          </div>
          <div>
            {hasCopied ? (
              <Check className="h-6 w-6 text-green" />
            ) : (
              <Copy
                className="h-6 w-6 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  setHasCopied(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InviteFriendModal;
