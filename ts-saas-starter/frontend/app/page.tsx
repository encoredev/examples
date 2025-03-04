import Link from "next/link";
import {Button} from "../components/ui/button";
import {ArrowRight, CheckCircle2} from "lucide-react";

export default function Home() {
    return (
        <>
            {/* Hero */}
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                        The Modern SaaS Template
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Start your SaaS business in minutes with our complete template. Authentication,
                                        payments, and user management — all included.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button asChild size="lg">
                                        <Link href="/signup">
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4"/>
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href="/login">
                                            Log In
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="rounded-lg border bg-card p-8 shadow-sm">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Built with modern technologies</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary"
                                                         fill="currentColor">
                                                        <path
                                                            d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-medium">Next.js</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary"
                                                         fill="currentColor">
                                                        <path
                                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-medium">Encore</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <svg className="h-6 w-6 text-primary" fill="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            d="M22.648 11.276c0-6.469-5.283-11.724-11.786-11.724C4.357-.448-.926 5.807.148 12.11c.609 3.546 2.91 6.65 6.171 8.324 3.684 1.897 8.119 1.743 11.654-.398 3.029-1.84 4.912-5.132 4.675-8.76zm-4.233 5.17c-.274.434-.6.839-.964 1.212-1.146 1.166-2.651 1.976-4.272 2.333-1.93.428-3.682.11-5.186-.715a5.394 5.394 0 01-1.275-.98c-.939-.893-1.465-1.986-1.547-3.349-.138-2.232.886-3.936 2.732-5.16 1.728-1.144 3.64-1.387 5.634-.737 1.977.644 3.346 2 3.866 4.018.118.457.193.93.21 1.405.016.539-.042 1.085-.198 1.973z"/>
                                                        <path
                                                            d="M14.272 9.102c-.142-.182-.291-.358-.501-.477a4.16 4.16 0 00-.623-.275c-.218-.083-.446-.15-.675-.21-.253-.068-.485-.124-.708-.187-.187-.053-.39-.113-.59-.174-.173-.053-.318-.121-.427-.205-.087-.067-.132-.144-.132-.246 0-.135.075-.247.22-.323.217-.112.597-.111.813-.003.283.144.4.365.432.648.212.021.432.005.644-.005.264-.013.527-.027.786-.008-.041-.498-.221-.911-.572-1.227-.27-.243-.6-.41-.978-.487-.509-.104-1.028-.099-1.52.065-.428.143-.767.374-.967.785-.187.384-.183.783-.007 1.167.18.393.503.636.892.795.304.123.628.202.953.281.228.054.446.105.654.168.215.066.431.125.63.207.155.064.294.141.389.269.059.08.087.16.086.253 0 .19-.12.336-.248.422a.932.932 0 01-.456.14c-.293.022-.541-.064-.705-.31-.095-.144-.135-.302-.15-.491-.11-.141-.304-.16-.447-.18-.156-.021-.32-.019-.483-.01l-.388.014c.036.36.098.658.261.91.286.446.735.708 1.251.85.595.165 1.203.171 1.797.012.61-.164 1.072-.499 1.276-1.115.15-.449.138-.901-.034-1.335z"/>
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-medium">Better Auth</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <svg className="h-6 w-6 text-primary" fill="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-medium">TypeScript</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <svg className="h-6 w-6 text-primary" fill="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-medium">Stripe</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <svg className="h-6 w-6 text-primary" fill="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-medium">Tailwind CSS</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24"
                                                         fill="currentColor">
                                                        <path
                                                            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-medium">shadcn/ui</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
                    <div className="container mx-auto px-4 md:px-6">
                        <div
                            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Everything You Need to Build a SaaS
                            </h2>
                            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Our template includes all the essential features to get your SaaS up and running.
                            </p>
                        </div>
                        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    title: "Authentication",
                                    description: "Secure user authentication with sign up, login, and profile management.",
                                },
                                {
                                    title: "Subscription Management",
                                    description: "Integrated Stripe billing with multiple subscription plans.",
                                },
                                {
                                    title: "User Dashboard",
                                    description: "A complete dashboard for users to manage their account.",
                                },
                                {
                                    title: "Profile Management",
                                    description: "Let users edit their profile and upload profile pictures.",
                                },
                                {
                                    title: "Responsive Design",
                                    description: "Beautifully designed UI that works on mobile and desktop.",
                                },
                                {
                                    title: "Easy Setup",
                                    description: "Get started in minutes with our simple configuration.",
                                },
                            ].map((feature, index) => (
                                <div key={index}
                                     className="flex flex-col items-center gap-2 rounded-lg bg-background p-6 shadow-sm">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <CheckCircle2 className="h-6 w-6 text-primary"/>
                                    </div>
                                    <h3 className="text-xl font-bold">{feature.title}</h3>
                                    <p className="text-center text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full py-12 md:py-24 lg:py-32 border-t">
                    <div className="container mx-auto px-4 md:px-6">
                        <div
                            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Ready to Get Started?
                            </h2>
                            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Start your SaaS journey today with our comprehensive template.
                            </p>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Button asChild size="lg">
                                    <Link href="/signup">
                                        Get Started for Free
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/login">
                                        Log In
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-6 w-full">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 font-semibold">
                                <div className="h-6 w-6 rounded-full bg-primary"/>
                                <span>SaaS Template</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} SaaS Template. All rights reserved.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Product</h3>
                            <nav className="flex flex-col gap-2">
                                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                                    Features
                                </Link>
                                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                                    Pricing
                                </Link>
                            </nav>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Company</h3>
                            <nav className="flex flex-col gap-2">
                                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                                    About
                                </Link>
                                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                                    Contact
                                </Link>
                            </nav>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Legal</h3>
                            <nav className="flex flex-col gap-2">
                                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                                    Privacy
                                </Link>
                                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                                    Terms
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}