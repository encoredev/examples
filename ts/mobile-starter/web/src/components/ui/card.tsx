import type * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-surface-elevated p-6 shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			className={cn("font-semibold text-lg text-text", className)}
			{...props}
		/>
	);
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn("text-sm text-text-secondary", className)}
			{...props}
		/>
	);
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("", className)} {...props} />;
}
