export {};

// Allows us to type the metadata and other clerk fields.
// Please see https://clerk.com/docs/guides/custom-types for more information.
declare global {
	interface OrganizationPrivateMetadata {
		stripeCustomerId?: string;
	}
}
