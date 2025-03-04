CREATE TYPE "public"."tier" AS ENUM('FREE', 'PRO', 'PREMIUM', 'ENTERPRISE');--> statement-breakpoint
CREATE TABLE "subscription_tier_users_assignment" (
	"userId" text NOT NULL,
	"subscriptionTierId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_tiers" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" "tier" DEFAULT 'FREE' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "subscription_tier_users_assignment" ADD CONSTRAINT "subscription_tier_users_assignment_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_tier_users_assignment" ADD CONSTRAINT "subscription_tier_users_assignment_subscriptionTierId_subscription_tiers_userId_fk" FOREIGN KEY ("subscriptionTierId") REFERENCES "public"."subscription_tiers"("userId") ON DELETE no action ON UPDATE no action;