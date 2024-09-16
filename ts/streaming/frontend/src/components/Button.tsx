import { ButtonHTMLAttributes, FC } from "react";

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`rounded p-2 border border-black w-fit disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
