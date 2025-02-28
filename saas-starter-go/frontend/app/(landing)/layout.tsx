import { Header } from "./header";

export default function LandingLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div>
			<Header />

			{children}
		</div>
	);
}
