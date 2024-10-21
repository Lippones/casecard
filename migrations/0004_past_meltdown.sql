ALTER TABLE "purchases" ADD COLUMN "access_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_access_key_unique" UNIQUE("access_key");