CREATE TABLE IF NOT EXISTS "artworks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"access_key" text NOT NULL,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "artworks_access_key_unique" UNIQUE("access_key")
);
--> statement-breakpoint
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_access_key_unique";--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "art_work_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "payment_id" text;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" DROP COLUMN IF EXISTS "access_key";--> statement-breakpoint
ALTER TABLE "purchases" DROP COLUMN IF EXISTS "image_url";