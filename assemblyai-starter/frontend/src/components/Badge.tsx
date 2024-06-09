import { FC } from "react";

export const Badge: FC<{
  color: "green" | "red" | "blue" | "gray";
  children?: React.ReactNode;
}> = ({ color, children }) => {
  const [bgColor, textColor, borderColor] = {
    green: ["bg-green-100", "text-green-800", "border-green-200"],
    red: ["bg-red-100", "text-red-800", "border-red-200"],
    blue: ["bg-blue-100", "text-blue-800", "border-blue-200"],
    gray: ["bg-gray-100", "text-gray-800", "border-gray-200"],
  }[color]!;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium uppercase ${bgColor} ${textColor} border ${borderColor}`}
    >
      {children}
    </span>
  );
};
