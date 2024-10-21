CREATE TYPE "public"."delivery_method" AS ENUM('email', 'home');--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "delivery_method" "delivery_method";