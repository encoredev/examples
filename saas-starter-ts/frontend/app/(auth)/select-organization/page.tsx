import { CreateOrganization, OrganizationSwitcher } from "@clerk/nextjs";

/**
 * This page renders the Clerk CreateOrganization component.
 * See https://clerk.com/docs/components/organization/create-organization for more information.
 */
export default function CreateOrganizationPage() {
	return (
		<div className="min-h-screen flex flex-col gap-4 items-center justify-center">
			<p>Select an organization to continue.</p>

			<OrganizationSwitcher
				afterSelectOrganizationUrl="/dashboard"
				afterCreateOrganizationUrl="/dashboard"
				hidePersonal
				defaultOpen
			/>
		</div>
	);
}
