import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import img1 from "./img1.jpg";
import img2 from "./img2.jpg";
import img3 from "./img3.jpg";
import img4 from "./img4.jpg";

export default function Home() {
	return (
		<div className="container">
			<section className="py-12 md:py-20">
				<div className="container">
					<div className="flex flex-col items-center gap-8 md:flex-row">
						<div className="flex-1">
							<div className="flex flex-col gap-4 lg:gap-8">
								<h1 className="max-w-[80%] text-4xl leading-tight font-semibold text-foreground lg:text-5xl xl:text-7xl">
									Encore.ts Saas Starter
								</h1>
								<p className="text-lg leading-relaxed text-muted-foreground xl:text-2xl">
									Build your SaaS quickly with{" "}
									<a href="https://encore.dev">Encore.ts</a>,{" "}
									<a href="https://nextjs.org">Next.js</a>,{" "}
									<a href="https://clerk.com">Clerk</a>,{" "}
									<a href="https://stripe.com">Stripe</a>,{" "}
									<a href="https://tailwindcss.com">TailwindCSS</a> and{" "}
									<a href="https://ui.shadcn.com">shadcn/ui</a>.
								</p>
							</div>
							<div className="my-6 lg:my-10">
								<Button asChild size="lg">
									<Link href="/pricing">Pricing</Link>
								</Button>
							</div>
						</div>

						<div className="w-full flex-1">
							<div className="w-full max-w-[50rem]">
								<AspectRatio ratio={1 / 1} className="h-full w-full">
									<div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[3.5%]">
										<div className="overflow-hidden rounded-[5.2%] border border-muted bg-muted">
											<Image
												src={img1}
												alt=""
												className="object-cover h-full w-full object-center"
											/>
										</div>
										<div className="relative overflow-hidden rounded-[5.2%] border border-muted bg-muted">
											<Image
												src={img2}
												alt=""
												className="object-cover h-full w-full object-center"
											/>
										</div>
										<div className="relative overflow-hidden rounded-[5.2%] border border-muted bg-muted">
											<Image
												src={img3}
												alt=""
												className="object-cover h-full w-full object-center"
											/>
										</div>
										<div className="relative overflow-hidden rounded-[5.2%] border border-muted bg-muted">
											<Image
												src={img4}
												alt=""
												className="object-cover h-full w-full object-center"
											/>
										</div>
									</div>
								</AspectRatio>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
