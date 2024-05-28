import { FC, useEffect, useRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";

const PromptInput: FC<{
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}> = ({ value, onChange, onSubmit, isLoading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textAreaAdjustHeight = () => {
    const el = textareaRef.current;
    if (el === null) return;
    el.style.height = "5px";
    el.style.height = el.scrollHeight + "px";
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  const setFocus = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    textAreaAdjustHeight();
  }, [textareaRef, value]);

  return (
    <div
      className="flex flex-row items-center relative w-full px-4 py-3 flex mt-10 border border-opacity-10 border-black cursor-text"
      onClick={setFocus}
    >
      <textarea
        ref={textareaRef}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        value={value}
        rows={1}
        className="outline-none overflow-hidden resize-none w-full pr-2"
        placeholder="Text here..."
      ></textarea>
      <button
        onClick={onSubmit}
        className="group flex items-center justify-center w-[35px] min-h-[35px] bottom-[15px] right-[15px] bg-black text-white rounded-md h-fit"
      >
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <ArrowUp size={20} className="transition group-hover:scale-[1.2]" />
        )}
      </button>
    </div>
  );
};

const LoadingIndicator: FC = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-100"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default PromptInput;
