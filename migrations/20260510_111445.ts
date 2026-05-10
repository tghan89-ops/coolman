import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE EXTENSION IF NOT EXISTS unaccent;
  CREATE TYPE "public"."enum_admin_users_role" AS ENUM('admin', 'marketing');
  CREATE TYPE "public"."enum__admin_users_v_version_role" AS ENUM('admin', 'marketing');
  CREATE TYPE "public"."enum_products_bond_type" AS ENUM('soft', 'medium', 'hard', 'extraHard');
  CREATE TYPE "public"."enum_orders_order_status" AS ENUM('pending', 'acknowledged', 'fulfilled', 'cancelled');
  CREATE TYPE "public"."enum_email_deliveries_status" AS ENUM('queued', 'sent', 'failed', 'bounced');
  CREATE TYPE "public"."enum_cron_runs_status" AS ENUM('running', 'completed', 'failed');
  CREATE TABLE "admin_users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admin_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_admin_users_role" DEFAULT 'marketing' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "_admin_users_v_version_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "_admin_users_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_role" "enum__admin_users_v_version_role" DEFAULT 'marketing' NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_email" varchar NOT NULL,
  	"version_reset_password_token" varchar,
  	"version_reset_password_expiration" timestamp(3) with time zone,
  	"version_salt" varchar,
  	"version_hash" varchar,
  	"version_login_attempts" numeric DEFAULT 0,
  	"version_lock_until" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contractors_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "contractors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"phone" varchar,
  	"delivery_address" varchar,
  	"tier_discount_pct" numeric DEFAULT 0,
  	"email_verified_at" timestamp(3) with time zone,
  	"deactivated_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contractors_v_version_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "_contractors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_company_name" varchar NOT NULL,
  	"version_phone" varchar,
  	"version_delivery_address" varchar,
  	"version_tier_discount_pct" numeric DEFAULT 0,
  	"version_email_verified_at" timestamp(3) with time zone,
  	"version_deactivated_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_email" varchar NOT NULL,
  	"version_reset_password_token" varchar,
  	"version_reset_password_expiration" timestamp(3) with time zone,
  	"version_salt" varchar,
  	"version_hash" varchar,
  	"version_login_attempts" numeric DEFAULT 0,
  	"version_lock_until" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "materials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_b_m" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_b_m" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_b_m" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "machine_tiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"name_b_m" varchar NOT NULL,
  	"power_range" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sku" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"name_b_m" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"description_b_m" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"machine_tier_id" integer NOT NULL,
  	"list_price" numeric NOT NULL,
  	"diameter" varchar,
  	"arbor_size" varchar,
  	"segment_height" varchar,
  	"bond_type" "enum_products_bond_type",
  	"max_r_p_m" varchar,
  	"youtube_url" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"materials_id" integer,
  	"applications_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "promo_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"promo_discount_pct" numeric NOT NULL,
  	"valid_from" timestamp(3) with time zone NOT NULL,
  	"valid_until" timestamp(3) with time zone NOT NULL,
  	"usage_cap" numeric NOT NULL,
  	"usage_count" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_promo_codes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_code" varchar NOT NULL,
  	"version_promo_discount_pct" numeric NOT NULL,
  	"version_valid_from" timestamp(3) with time zone NOT NULL,
  	"version_valid_until" timestamp(3) with time zone NOT NULL,
  	"version_usage_cap" numeric NOT NULL,
  	"version_usage_count" numeric DEFAULT 0,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contractor_id" integer NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"delivery_address" varchar NOT NULL,
  	"notes" varchar,
  	"list_price_at_submit" numeric NOT NULL,
  	"tier_discount_pct_at_submit" numeric NOT NULL,
  	"promo_discount_pct_at_submit" numeric DEFAULT 0,
  	"effective_price_at_submit" numeric NOT NULL,
  	"order_status" "enum_orders_order_status" DEFAULT 'pending' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"acknowledged_at" timestamp(3) with time zone,
  	"duplicate_flag" boolean DEFAULT false,
  	"idempotency_key" varchar NOT NULL,
  	"promo_code_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_logs_viewed_product_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" varchar
  );
  
  CREATE TABLE "search_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"query" varchar,
  	"query_normalized" varchar,
  	"material_id" integer,
  	"application_id" integer,
  	"machine_tier_id" integer,
  	"contractor_id" integer,
  	"result_count" numeric DEFAULT 0,
  	"submitted_order_id_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_deliveries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" integer,
  	"recipient" varchar NOT NULL,
  	"resend_message_id" varchar,
  	"status" "enum_email_deliveries_status" DEFAULT 'queued' NOT NULL,
  	"retry_count" numeric DEFAULT 0,
  	"last_error" varchar,
  	"sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cron_runs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"job_name" varchar NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"status" "enum_cron_runs_status" DEFAULT 'running' NOT NULL,
  	"rows_processed" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admin_users_id" integer,
  	"contractors_id" integer,
  	"materials_id" integer,
  	"applications_id" integer,
  	"categories_id" integer,
  	"machine_tiers_id" integer,
  	"products_id" integer,
  	"promo_codes_id" integer,
  	"orders_id" integer,
  	"search_logs_id" integer,
  	"email_deliveries_id" integer,
  	"cron_runs_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admin_users_id" integer,
  	"contractors_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"stat" varchar NOT NULL,
  	"stat_label" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_application_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"image" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge" varchar DEFAULT 'Trusted by 500+ Malaysian Contractors',
  	"hero_headline_line1" varchar DEFAULT 'Industrial',
  	"hero_headline_line2" varchar DEFAULT 'Diamond Tools',
  	"hero_headline_line3" varchar DEFAULT 'Built for Performance',
  	"hero_subheadline" varchar DEFAULT 'Industrial-grade cutting solutions engineered for concrete, granite, marble, and more.',
  	"hero_primary_cta_label" varchar DEFAULT 'Explore Products',
  	"hero_secondary_cta_label" varchar DEFAULT 'Watch Demo',
  	"hero_hero_image_id" integer,
  	"cta_section_headline" varchar DEFAULT 'Ready to Elevate Your Operations?',
  	"cta_section_subheadline" varchar DEFAULT 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.',
  	"cta_section_primary_cta_label" varchar DEFAULT 'Request Consultation',
  	"cta_section_secondary_cta_label" varchar DEFAULT 'Download Catalog',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "applications_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "applications_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'Applications',
  	"hero_subtitle" varchar DEFAULT 'Find the right Coolman blade for your specific material and application.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "applications_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "resources_page_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "resources_page_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"youtube_url" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "resources_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'Resources',
  	"hero_subtitle" varchar DEFAULT 'Technical guides, datasheets, and videos to help you get the most from Coolman tools.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'Contact Us',
  	"hero_subtitle" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"address" varchar,
  	"map_embed_url" varchar,
  	"whatsapp_number" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "shibuya_page_craftsmanship_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "shibuya_page_machines_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "shibuya_page_machines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"model_id" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"motor_power" varchar NOT NULL,
  	"max_diameter" varchar NOT NULL,
  	"weight" varchar NOT NULL,
  	"rpm_range" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "shibuya_page_support_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "shibuya_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge" varchar DEFAULT 'ENGINEERED IN JAPAN',
  	"hero_headline_line1" varchar DEFAULT 'Precision Without',
  	"hero_headline_line2" varchar DEFAULT 'Compromise',
  	"hero_subheadline" varchar DEFAULT 'Shibuya core drilling machines represent five decades of Japanese engineering excellence.',
  	"hero_hero_image_id" integer,
  	"heritage_since" varchar DEFAULT 'SINCE 1973',
  	"heritage_statement" varchar DEFAULT 'Five decades of relentless pursuit of perfection. Every Shibuya machine is a testament to Japanese craftsmanship.',
  	"craftsmanship_section_label" varchar DEFAULT 'CRAFTSMANSHIP',
  	"craftsmanship_title" varchar DEFAULT 'Built to Last Generations',
  	"craftsmanship_body" varchar DEFAULT 'Every Shibuya machine begins its life in our Osaka manufacturing facility.',
  	"craftsmanship_image_id" integer,
  	"in_action_title" varchar DEFAULT 'Built for Real Work',
  	"in_action_body" varchar DEFAULT 'From high-rise construction to infrastructure projects, Shibuya machines perform flawlessly.',
  	"in_action_image_id" integer,
  	"support_title" varchar DEFAULT 'We Stand Behind Every Machine',
  	"cta_headline" varchar DEFAULT 'Experience the Difference',
  	"cta_subheadline" varchar DEFAULT 'Schedule a demonstration at your site or visit our showroom.',
  	"cta_primary_cta_label" varchar DEFAULT 'Schedule Demo',
  	"cta_secondary_cta_label" varchar DEFAULT 'Download Brochure',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orders_paused" boolean DEFAULT false,
  	"alert_threshold_hours" numeric DEFAULT 24,
  	"duplicate_window_minutes" numeric DEFAULT 10,
  	"tier_discount_warn_above" numeric DEFAULT 0.3,
  	"order_rate_limit_per_hour" numeric DEFAULT 20,
  	"search_log_debounce_ms" numeric DEFAULT 800,
  	"max_combined_discount_pct" numeric DEFAULT 0.4,
  	"registration_rate_limit_per_ip_per_day" numeric DEFAULT 5,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_orders_paused" boolean DEFAULT false,
  	"version_alert_threshold_hours" numeric DEFAULT 24,
  	"version_duplicate_window_minutes" numeric DEFAULT 10,
  	"version_tier_discount_warn_above" numeric DEFAULT 0.3,
  	"version_order_rate_limit_per_hour" numeric DEFAULT 20,
  	"version_search_log_debounce_ms" numeric DEFAULT 800,
  	"version_max_combined_discount_pct" numeric DEFAULT 0.4,
  	"version_registration_rate_limit_per_ip_per_day" numeric DEFAULT 5,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "admin_users_sessions" ADD CONSTRAINT "admin_users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_admin_users_v_version_sessions" ADD CONSTRAINT "_admin_users_v_version_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_admin_users_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_admin_users_v" ADD CONSTRAINT "_admin_users_v_parent_id_admin_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contractors_sessions" ADD CONSTRAINT "contractors_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contractors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contractors_v_version_sessions" ADD CONSTRAINT "_contractors_v_version_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contractors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contractors_v" ADD CONSTRAINT "_contractors_v_parent_id_contractors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contractors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_photos" ADD CONSTRAINT "products_photos_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_photos" ADD CONSTRAINT "products_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_machine_tier_id_machine_tiers_id_fk" FOREIGN KEY ("machine_tier_id") REFERENCES "public"."machine_tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_promo_codes_v" ADD CONSTRAINT "_promo_codes_v_parent_id_promo_codes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."promo_codes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_contractor_id_contractors_id_fk" FOREIGN KEY ("contractor_id") REFERENCES "public"."contractors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_promo_code_id_promo_codes_id_fk" FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_logs_viewed_product_ids" ADD CONSTRAINT "search_logs_viewed_product_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_machine_tier_id_machine_tiers_id_fk" FOREIGN KEY ("machine_tier_id") REFERENCES "public"."machine_tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_contractor_id_contractors_id_fk" FOREIGN KEY ("contractor_id") REFERENCES "public"."contractors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_logs" ADD CONSTRAINT "search_logs_submitted_order_id_id_orders_id_fk" FOREIGN KEY ("submitted_order_id_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contractors_fk" FOREIGN KEY ("contractors_id") REFERENCES "public"."contractors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_materials_fk" FOREIGN KEY ("materials_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_machine_tiers_fk" FOREIGN KEY ("machine_tiers_id") REFERENCES "public"."machine_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promo_codes_fk" FOREIGN KEY ("promo_codes_id") REFERENCES "public"."promo_codes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_logs_fk" FOREIGN KEY ("search_logs_id") REFERENCES "public"."search_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_deliveries_fk" FOREIGN KEY ("email_deliveries_id") REFERENCES "public"."email_deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cron_runs_fk" FOREIGN KEY ("cron_runs_id") REFERENCES "public"."cron_runs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admin_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_contractors_fk" FOREIGN KEY ("contractors_id") REFERENCES "public"."contractors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stats" ADD CONSTRAINT "home_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_features" ADD CONSTRAINT "home_page_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_application_list" ADD CONSTRAINT "home_page_application_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_page_sections" ADD CONSTRAINT "applications_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_page_sections" ADD CONSTRAINT "applications_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_rels" ADD CONSTRAINT "applications_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."applications_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_rels" ADD CONSTRAINT "applications_page_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_page_downloads" ADD CONSTRAINT "resources_page_downloads_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_page_downloads" ADD CONSTRAINT "resources_page_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_page_videos" ADD CONSTRAINT "resources_page_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shibuya_page_craftsmanship_points" ADD CONSTRAINT "shibuya_page_craftsmanship_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shibuya_page_machines_features" ADD CONSTRAINT "shibuya_page_machines_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page_machines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shibuya_page_machines" ADD CONSTRAINT "shibuya_page_machines_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shibuya_page_machines" ADD CONSTRAINT "shibuya_page_machines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shibuya_page_support_items" ADD CONSTRAINT "shibuya_page_support_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shibuya_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shibuya_page" ADD CONSTRAINT "shibuya_page_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shibuya_page" ADD CONSTRAINT "shibuya_page_craftsmanship_image_id_media_id_fk" FOREIGN KEY ("craftsmanship_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shibuya_page" ADD CONSTRAINT "shibuya_page_in_action_image_id_media_id_fk" FOREIGN KEY ("in_action_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "admin_users_sessions_order_idx" ON "admin_users_sessions" USING btree ("_order");
  CREATE INDEX "admin_users_sessions_parent_id_idx" ON "admin_users_sessions" USING btree ("_parent_id");
  CREATE INDEX "admin_users_updated_at_idx" ON "admin_users" USING btree ("updated_at");
  CREATE INDEX "admin_users_created_at_idx" ON "admin_users" USING btree ("created_at");
  CREATE UNIQUE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");
  CREATE INDEX "_admin_users_v_version_sessions_order_idx" ON "_admin_users_v_version_sessions" USING btree ("_order");
  CREATE INDEX "_admin_users_v_version_sessions_parent_id_idx" ON "_admin_users_v_version_sessions" USING btree ("_parent_id");
  CREATE INDEX "_admin_users_v_parent_idx" ON "_admin_users_v" USING btree ("parent_id");
  CREATE INDEX "_admin_users_v_version_version_updated_at_idx" ON "_admin_users_v" USING btree ("version_updated_at");
  CREATE INDEX "_admin_users_v_version_version_created_at_idx" ON "_admin_users_v" USING btree ("version_created_at");
  CREATE INDEX "_admin_users_v_version_version_email_idx" ON "_admin_users_v" USING btree ("version_email");
  CREATE INDEX "_admin_users_v_created_at_idx" ON "_admin_users_v" USING btree ("created_at");
  CREATE INDEX "_admin_users_v_updated_at_idx" ON "_admin_users_v" USING btree ("updated_at");
  CREATE INDEX "contractors_sessions_order_idx" ON "contractors_sessions" USING btree ("_order");
  CREATE INDEX "contractors_sessions_parent_id_idx" ON "contractors_sessions" USING btree ("_parent_id");
  CREATE INDEX "contractors_updated_at_idx" ON "contractors" USING btree ("updated_at");
  CREATE INDEX "contractors_created_at_idx" ON "contractors" USING btree ("created_at");
  CREATE UNIQUE INDEX "contractors_email_idx" ON "contractors" USING btree ("email");
  CREATE INDEX "_contractors_v_version_sessions_order_idx" ON "_contractors_v_version_sessions" USING btree ("_order");
  CREATE INDEX "_contractors_v_version_sessions_parent_id_idx" ON "_contractors_v_version_sessions" USING btree ("_parent_id");
  CREATE INDEX "_contractors_v_parent_idx" ON "_contractors_v" USING btree ("parent_id");
  CREATE INDEX "_contractors_v_version_version_updated_at_idx" ON "_contractors_v" USING btree ("version_updated_at");
  CREATE INDEX "_contractors_v_version_version_created_at_idx" ON "_contractors_v" USING btree ("version_created_at");
  CREATE INDEX "_contractors_v_version_version_email_idx" ON "_contractors_v" USING btree ("version_email");
  CREATE INDEX "_contractors_v_created_at_idx" ON "_contractors_v" USING btree ("created_at");
  CREATE INDEX "_contractors_v_updated_at_idx" ON "_contractors_v" USING btree ("updated_at");
  CREATE INDEX "materials_updated_at_idx" ON "materials" USING btree ("updated_at");
  CREATE INDEX "materials_created_at_idx" ON "materials" USING btree ("created_at");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "machine_tiers_updated_at_idx" ON "machine_tiers" USING btree ("updated_at");
  CREATE INDEX "machine_tiers_created_at_idx" ON "machine_tiers" USING btree ("created_at");
  CREATE INDEX "products_photos_order_idx" ON "products_photos" USING btree ("_order");
  CREATE INDEX "products_photos_parent_id_idx" ON "products_photos" USING btree ("_parent_id");
  CREATE INDEX "products_photos_photo_idx" ON "products_photos" USING btree ("photo_id");
  CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_machine_tier_idx" ON "products" USING btree ("machine_tier_id");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_materials_id_idx" ON "products_rels" USING btree ("materials_id");
  CREATE INDEX "products_rels_applications_id_idx" ON "products_rels" USING btree ("applications_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE UNIQUE INDEX "promo_codes_code_idx" ON "promo_codes" USING btree ("code");
  CREATE INDEX "promo_codes_updated_at_idx" ON "promo_codes" USING btree ("updated_at");
  CREATE INDEX "promo_codes_created_at_idx" ON "promo_codes" USING btree ("created_at");
  CREATE INDEX "_promo_codes_v_parent_idx" ON "_promo_codes_v" USING btree ("parent_id");
  CREATE INDEX "_promo_codes_v_version_version_code_idx" ON "_promo_codes_v" USING btree ("version_code");
  CREATE INDEX "_promo_codes_v_version_version_updated_at_idx" ON "_promo_codes_v" USING btree ("version_updated_at");
  CREATE INDEX "_promo_codes_v_version_version_created_at_idx" ON "_promo_codes_v" USING btree ("version_created_at");
  CREATE INDEX "_promo_codes_v_created_at_idx" ON "_promo_codes_v" USING btree ("created_at");
  CREATE INDEX "_promo_codes_v_updated_at_idx" ON "_promo_codes_v" USING btree ("updated_at");
  CREATE INDEX "orders_contractor_idx" ON "orders" USING btree ("contractor_id");
  CREATE INDEX "orders_product_idx" ON "orders" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_idempotency_key_idx" ON "orders" USING btree ("idempotency_key");
  CREATE INDEX "orders_promo_code_idx" ON "orders" USING btree ("promo_code_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "search_logs_viewed_product_ids_order_idx" ON "search_logs_viewed_product_ids" USING btree ("_order");
  CREATE INDEX "search_logs_viewed_product_ids_parent_id_idx" ON "search_logs_viewed_product_ids" USING btree ("_parent_id");
  CREATE INDEX "search_logs_material_idx" ON "search_logs" USING btree ("material_id");
  CREATE INDEX "search_logs_application_idx" ON "search_logs" USING btree ("application_id");
  CREATE INDEX "search_logs_machine_tier_idx" ON "search_logs" USING btree ("machine_tier_id");
  CREATE INDEX "search_logs_contractor_idx" ON "search_logs" USING btree ("contractor_id");
  CREATE INDEX "search_logs_submitted_order_id_idx" ON "search_logs" USING btree ("submitted_order_id_id");
  CREATE INDEX "search_logs_updated_at_idx" ON "search_logs" USING btree ("updated_at");
  CREATE INDEX "search_logs_created_at_idx" ON "search_logs" USING btree ("created_at");
  CREATE INDEX "email_deliveries_order_idx" ON "email_deliveries" USING btree ("order_id");
  CREATE INDEX "email_deliveries_updated_at_idx" ON "email_deliveries" USING btree ("updated_at");
  CREATE INDEX "email_deliveries_created_at_idx" ON "email_deliveries" USING btree ("created_at");
  CREATE INDEX "cron_runs_updated_at_idx" ON "cron_runs" USING btree ("updated_at");
  CREATE INDEX "cron_runs_created_at_idx" ON "cron_runs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admin_users_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_users_id");
  CREATE INDEX "payload_locked_documents_rels_contractors_id_idx" ON "payload_locked_documents_rels" USING btree ("contractors_id");
  CREATE INDEX "payload_locked_documents_rels_materials_id_idx" ON "payload_locked_documents_rels" USING btree ("materials_id");
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_machine_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("machine_tiers_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_promo_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("promo_codes_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_search_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("search_logs_id");
  CREATE INDEX "payload_locked_documents_rels_email_deliveries_id_idx" ON "payload_locked_documents_rels" USING btree ("email_deliveries_id");
  CREATE INDEX "payload_locked_documents_rels_cron_runs_id_idx" ON "payload_locked_documents_rels" USING btree ("cron_runs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admin_users_id_idx" ON "payload_preferences_rels" USING btree ("admin_users_id");
  CREATE INDEX "payload_preferences_rels_contractors_id_idx" ON "payload_preferences_rels" USING btree ("contractors_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_stats_order_idx" ON "home_page_stats" USING btree ("_order");
  CREATE INDEX "home_page_stats_parent_id_idx" ON "home_page_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_features_order_idx" ON "home_page_features" USING btree ("_order");
  CREATE INDEX "home_page_features_parent_id_idx" ON "home_page_features" USING btree ("_parent_id");
  CREATE INDEX "home_page_application_list_order_idx" ON "home_page_application_list" USING btree ("_order");
  CREATE INDEX "home_page_application_list_parent_id_idx" ON "home_page_application_list" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_hero_hero_image_idx" ON "home_page" USING btree ("hero_hero_image_id");
  CREATE INDEX "applications_page_sections_order_idx" ON "applications_page_sections" USING btree ("_order");
  CREATE INDEX "applications_page_sections_parent_id_idx" ON "applications_page_sections" USING btree ("_parent_id");
  CREATE INDEX "applications_page_sections_image_idx" ON "applications_page_sections" USING btree ("image_id");
  CREATE INDEX "applications_page_rels_order_idx" ON "applications_page_rels" USING btree ("order");
  CREATE INDEX "applications_page_rels_parent_idx" ON "applications_page_rels" USING btree ("parent_id");
  CREATE INDEX "applications_page_rels_path_idx" ON "applications_page_rels" USING btree ("path");
  CREATE INDEX "applications_page_rels_products_id_idx" ON "applications_page_rels" USING btree ("products_id");
  CREATE INDEX "resources_page_downloads_order_idx" ON "resources_page_downloads" USING btree ("_order");
  CREATE INDEX "resources_page_downloads_parent_id_idx" ON "resources_page_downloads" USING btree ("_parent_id");
  CREATE INDEX "resources_page_downloads_file_idx" ON "resources_page_downloads" USING btree ("file_id");
  CREATE INDEX "resources_page_videos_order_idx" ON "resources_page_videos" USING btree ("_order");
  CREATE INDEX "resources_page_videos_parent_id_idx" ON "resources_page_videos" USING btree ("_parent_id");
  CREATE INDEX "shibuya_page_craftsmanship_points_order_idx" ON "shibuya_page_craftsmanship_points" USING btree ("_order");
  CREATE INDEX "shibuya_page_craftsmanship_points_parent_id_idx" ON "shibuya_page_craftsmanship_points" USING btree ("_parent_id");
  CREATE INDEX "shibuya_page_machines_features_order_idx" ON "shibuya_page_machines_features" USING btree ("_order");
  CREATE INDEX "shibuya_page_machines_features_parent_id_idx" ON "shibuya_page_machines_features" USING btree ("_parent_id");
  CREATE INDEX "shibuya_page_machines_order_idx" ON "shibuya_page_machines" USING btree ("_order");
  CREATE INDEX "shibuya_page_machines_parent_id_idx" ON "shibuya_page_machines" USING btree ("_parent_id");
  CREATE INDEX "shibuya_page_machines_image_idx" ON "shibuya_page_machines" USING btree ("image_id");
  CREATE INDEX "shibuya_page_support_items_order_idx" ON "shibuya_page_support_items" USING btree ("_order");
  CREATE INDEX "shibuya_page_support_items_parent_id_idx" ON "shibuya_page_support_items" USING btree ("_parent_id");
  CREATE INDEX "shibuya_page_hero_hero_hero_image_idx" ON "shibuya_page" USING btree ("hero_hero_image_id");
  CREATE INDEX "shibuya_page_craftsmanship_craftsmanship_image_idx" ON "shibuya_page" USING btree ("craftsmanship_image_id");
  CREATE INDEX "shibuya_page_in_action_in_action_image_idx" ON "shibuya_page" USING btree ("in_action_image_id");
  CREATE INDEX "_settings_v_created_at_idx" ON "_settings_v" USING btree ("created_at");
  CREATE INDEX "_settings_v_updated_at_idx" ON "_settings_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admin_users_sessions" CASCADE;
  DROP TABLE "admin_users" CASCADE;
  DROP TABLE "_admin_users_v_version_sessions" CASCADE;
  DROP TABLE "_admin_users_v" CASCADE;
  DROP TABLE "contractors_sessions" CASCADE;
  DROP TABLE "contractors" CASCADE;
  DROP TABLE "_contractors_v_version_sessions" CASCADE;
  DROP TABLE "_contractors_v" CASCADE;
  DROP TABLE "materials" CASCADE;
  DROP TABLE "applications" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "machine_tiers" CASCADE;
  DROP TABLE "products_photos" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "promo_codes" CASCADE;
  DROP TABLE "_promo_codes_v" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "search_logs_viewed_product_ids" CASCADE;
  DROP TABLE "search_logs" CASCADE;
  DROP TABLE "email_deliveries" CASCADE;
  DROP TABLE "cron_runs" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_stats" CASCADE;
  DROP TABLE "home_page_features" CASCADE;
  DROP TABLE "home_page_application_list" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "applications_page_sections" CASCADE;
  DROP TABLE "applications_page" CASCADE;
  DROP TABLE "applications_page_rels" CASCADE;
  DROP TABLE "resources_page_downloads" CASCADE;
  DROP TABLE "resources_page_videos" CASCADE;
  DROP TABLE "resources_page" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "shibuya_page_craftsmanship_points" CASCADE;
  DROP TABLE "shibuya_page_machines_features" CASCADE;
  DROP TABLE "shibuya_page_machines" CASCADE;
  DROP TABLE "shibuya_page_support_items" CASCADE;
  DROP TABLE "shibuya_page" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "_settings_v" CASCADE;
  DROP TYPE "public"."enum_admin_users_role";
  DROP TYPE "public"."enum__admin_users_v_version_role";
  DROP TYPE "public"."enum_products_bond_type";
  DROP TYPE "public"."enum_orders_order_status";
  DROP TYPE "public"."enum_email_deliveries_status";
  DROP TYPE "public"."enum_cron_runs_status";`)
}
