ALTER TYPE "public"."payment_status" ADD VALUE 'failed' BEFORE 'refunded';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "gateway_order_id" varchar(64);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "gateway_payment_id" varchar(64);--> statement-breakpoint
CREATE UNIQUE INDEX "orders_gateway_order_uq" ON "orders" USING btree ("gateway_order_id");