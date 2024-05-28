import { FC, Fragment, PropsWithChildren } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";

const SlideOver: FC<
  PropsWithChildren<{
    show: boolean;
    setShow: (val: boolean) => void;
  }>
> = ({ children, show, setShow }) => {
  return (
    <Transition as={Fragment} show={show}>
      <Dialog className="relative z-10 transition" onClose={setShow}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                {children}
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SlideOver;
