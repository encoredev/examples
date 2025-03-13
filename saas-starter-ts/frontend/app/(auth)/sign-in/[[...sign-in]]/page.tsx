import { SignIn } from "@clerk/nextjs";

/**
 * This page renders the Clerk SignIn component.
 * See https://clerk.com/docs/components/authentication/sign-in for more information.
 */
export default function SignInPage() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<SignIn />
		</div>
	);
}
