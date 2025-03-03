import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, Rat } from "lucide-react";
import Link from "next/link";

export function Header() {
	return (
		<header className="border-b">
			<div className="container flex items-center justify-between py-2">
				<Link href="/" className="text-xl font-bold flex items-center">
					<Rat className="size-5 mr-1" /> Acme
				</Link>

				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger>Features</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="w-80">
									<li>
										<NavigationMenuLink asChild>
											<Link href="/features#feature-1">
												<p className="font-medium leading-none">Stripe</p>
												<p className="text-sm text-muted-foreground leading-snug">
													Get paid easily
												</p>
											</Link>
										</NavigationMenuLink>
									</li>

									<li>
										<NavigationMenuLink asChild>
											<Link href="/features#feature-2">
												<p className="font-medium leading-none">Clerk</p>
												<p className="text-sm text-muted-foreground leading-snug">
													Auth is already setup
												</p>
											</Link>
										</NavigationMenuLink>
									</li>

									<li>
										<NavigationMenuLink asChild>
											<Link href="/features#feature-3">
												<p className="font-medium leading-none">shadcn</p>
												<p className="text-sm text-muted-foreground leading-snug">
													Uses shadcn/ui for components
												</p>
											</Link>
										</NavigationMenuLink>
									</li>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<Link href="/company" legacyBehavior passHref>
								<NavigationMenuLink>Company</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<Link href="/pricing" legacyBehavior passHref>
								<NavigationMenuLink>Pricing</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				<SignedOut>
					<SignInButton fallbackRedirectUrl="/dashboard">
						<Button>
							Sign in <ArrowRight />
						</Button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</header>
	);
}
