import { ComponentProps, FC } from "react";

const Button: FC<
  { size: "sm" | "lg"; mode: "dark" | "light" } & ComponentProps<"button">
> = ({ size, mode, ...props }) => {
  return (
    <button
      {...props}
      className={`
        whitespace-nowrap rounded-md font-semibold shadow-sm transition
        ${mode === "light" ? "bg-white/10 text-white hover:bg-white/20" : ""}
        ${mode === "dark" ? "bg-black/10 text-black hover:bg-black/20" : ""}
        ${size === "lg" ? "text-lg px-3.5 py-2.5" : "text-sm px-2 py-1"}
        ${props.disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
    />
  );
};

export default Button;
