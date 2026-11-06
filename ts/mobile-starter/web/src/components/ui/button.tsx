import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary:
					"rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover",
				outline:
					"rounded-lg border border-border bg-transparent text-text hover:bg-surface-muted",
				destructive:
					"rounded-lg bg-error text-text-invert hover:bg-error/90",
				ghost:
					"rounded-lg bg-transparent text-text hover:bg-surface-muted",
			},
			size: {
				default: "px-6 py-3 text-sm",
				sm: "px-4 py-2 text-sm",
				lg: "px-8 py-4 text-base",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export function Button({
	className,
	variant,
	size,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}
