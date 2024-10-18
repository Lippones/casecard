CREATE TYPE "public"."payment_status" AS ENUM('paid', 'unpaid');--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "payment_status" "payment_status";