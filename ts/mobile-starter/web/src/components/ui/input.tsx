import type * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = "text", ...props }: InputProps) {
	return (
		<input
			type={type}
			className={cn(
				"flex w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-text transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}
