DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "order_items") THEN
    RAISE EXCEPTION 'Cannot convert legacy integer product IDs to UUIDs while order items exist';
  END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "shipping_postal_code" TO "shipping_zip_code";
--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "note" TO "notes";
--> statement-breakpoint
ALTER TABLE "orders"
  ALTER COLUMN "total_amount" SET DATA TYPE integer USING round("total_amount")::integer,
  ALTER COLUMN "total_currency" SET DEFAULT 'USD',
  ALTER COLUMN "shipping_street" SET DATA TYPE varchar USING "shipping_street"::varchar,
  ALTER COLUMN "shipping_street" DROP NOT NULL,
  ALTER COLUMN "shipping_city" SET DATA TYPE varchar USING "shipping_city"::varchar,
  ALTER COLUMN "shipping_city" DROP NOT NULL,
  ALTER COLUMN "shipping_state" SET DATA TYPE varchar USING "shipping_state"::varchar,
  ALTER COLUMN "shipping_state" DROP NOT NULL,
  ALTER COLUMN "shipping_country" SET DATA TYPE varchar USING "shipping_country"::varchar,
  ALTER COLUMN "shipping_country" DROP NOT NULL,
  ALTER COLUMN "shipping_zip_code" SET DATA TYPE varchar USING "shipping_zip_code"::varchar,
  ALTER COLUMN "shipping_zip_code" DROP NOT NULL,
  ALTER COLUMN "tracking_number" SET DATA TYPE varchar USING "tracking_number"::varchar,
  ALTER COLUMN "tracking_number" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "order_items"
  ALTER COLUMN "product_id" SET DATA TYPE uuid USING "product_id"::text::uuid,
  ALTER COLUMN "discount_amount" DROP NOT NULL,
  ALTER COLUMN "discount_amount" DROP DEFAULT,
  ALTER COLUMN "discount_currency" DROP NOT NULL,
  ALTER COLUMN "discount_currency" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "order_items"
  ADD CONSTRAINT "order_items_product_id_products_id_fk"
  FOREIGN KEY ("product_id") REFERENCES "public"."products"("id")
  ON DELETE no action ON UPDATE no action;