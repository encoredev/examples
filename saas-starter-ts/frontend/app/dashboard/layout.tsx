import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { AppSidebar } from "./app-sidebar";

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<SidebarProvider>
			<AppSidebar collapsible="offcanvas" />

			<div className="w-full flex flex-col">
				<header className="flex items-center px-2 py-2 gap-2">
					<SidebarTrigger />
					<Separator orientation="vertical" />

					<div className="grow flex items-center justify-between">
						<p className="text-lg font-semibold">Acme</p>

						<UserButton />
					</div>
				</header>

				<div className="px-2 py-2">{children}</div>
			</div>
		</SidebarProvider>
	);
}
