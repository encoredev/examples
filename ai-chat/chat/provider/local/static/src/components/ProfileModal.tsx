import { FC, useEffect, useState } from "react";
import { User } from "@chatscope/use-chat";
import { DialogTitle } from "@headlessui/react";
import Modal, { ModalProps } from "./Modal.tsx";
import Button from "./Button.tsx";

const ProfileModal: FC<
  ModalProps & {
    user?: User;
    removeFromChannel: () => void;
  }
> = ({ user, show, onHide, removeFromChannel }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(user);

  useEffect(() => {
    if (user) setCurrentUser(user);
  }, [user]);

  return (
    <Modal show={show} onHide={onHide}>
      <div>
        <img src={currentUser?.avatar} className="w-full rounded-md" />
        <div className="mt-3 sm:mt-5">
          <div className="flex items-center justify-between">
            <DialogTitle
              as="h3"
              className="flex items-center text-white text-2xl font-semibold leading-6"
            >
              {currentUser?.username}
              <span className="ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green">
                <span className="sr-only">Online</span>
              </span>
            </DialogTitle>
            <Button size="sm" mode="light" onClick={removeFromChannel}>
              Kick from channel
            </Button>
          </div>
          <div className="mt-2">
            <span className="text-gray-400 font-semibold leading-6">Bio</span>
            <p className="text-sm text-white">{currentUser?.bio}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
