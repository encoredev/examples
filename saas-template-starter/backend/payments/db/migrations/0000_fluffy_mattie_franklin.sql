CREATE TYPE "public"."tier" AS ENUM('FREE', 'PRO', 'PREMIUM', 'ENTERPRISE');--> statement-breakpoint
CREATE TABLE "product_price_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price_id" text NOT NULL,
	"product_id" text NOT NULL,
	"price" integer NOT NULL,
	"currency" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"event_type" text NOT NULL,
	"price_id" text NOT NULL,
	"invoice_id" text NOT NULL,
	"is_cancelled" boolean DEFAULT false NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"discount_percentage" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_price_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price_id" text NOT NULL,
	"tier" "tier" DEFAULT 'FREE' NOT NULL,
	"price" integer NOT NULL,
	"currency" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
