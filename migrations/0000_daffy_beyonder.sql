CREATE TYPE "public"."delivery_method" AS ENUM('email', 'home');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('paid', 'unpaid');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchases" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"access_key" text NOT NULL,
	"image_url" text NOT NULL,
	"value" numeric NOT NULL,
	"price_id" text NOT NULL,
	"email_sent" boolean DEFAULT false,
	"payment_status" "payment_status",
	"delivery_method" "delivery_method",
	CONSTRAINT "purchases_access_key_unique" UNIQUE("access_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
