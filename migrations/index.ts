import * as migration_20260510_111445 from './20260510_111445';
import * as migration_20260510_auth_fields from './20260510_auth_fields';
import * as migration_20260516_064610_add_media_image_sizes from './20260516_064610_add_media_image_sizes';
import * as migration_20260516_072830_add_alerted_at from './20260516_072830_add_alerted_at';
import * as migration_20260516_143030 from './20260516_143030';
import * as migration_20260516_153000_add_order_notify_emails from './20260516_153000_add_order_notify_emails';
import * as migration_20260516_180000_carts_and_order_submission_id from './20260516_180000_carts_and_order_submission_id';
import * as migration_20260516_190000_carts_locked_docs_rels from './20260516_190000_carts_locked_docs_rels';
import * as migration_20260516_210000_addresses from './20260516_210000_addresses';
import * as migration_20260516_220000_search_logs_summary from './20260516_220000_search_logs_summary';
import * as migration_20260517_030000_add_media_hero_size from './20260517_030000_add_media_hero_size';
import * as migration_20260523_add_product_documents from './20260523_add_product_documents';
import * as migration_20260523_add_settings_contact_emails from './20260523_add_settings_contact_emails';
import * as migration_20260523_create_missing_tables from './20260523_create_missing_tables';
import * as migration_20260523_shibuya_v2_redesign from './20260523_shibuya_v2_redesign';
import * as migration_20260523_add_locked_docs_rels from './20260523_add_locked_docs_rels'
import * as migration_20260523_rewire_home_and_why_coolman_globals from './20260523_rewire_home_and_why_coolman_globals';
import * as migration_20260523_add_heritage_page_global from './20260523_add_heritage_page_global';
import * as migration_20260523_fix_heritage_page_array_ids from './20260523_fix_heritage_page_array_ids';
import * as migration_20260524_add_settings_new_fields from './20260524_add_settings_new_fields';
import * as migration_20260524_add_settings_missing_columns from './20260524_add_settings_missing_columns';
import * as migration_20260524_add_login_attempts from './20260524_add_login_attempts';
import * as migration_20260614_add_product_family from './20260614_add_product_family';
import * as migration_20260615_add_product_variant_axis from './20260615_add_product_variant_axis';
import * as migration_20260621_add_pages_navigation from './20260621_add_pages_navigation';

export const migrations = [
  {
    up: migration_20260510_111445.up,
    down: migration_20260510_111445.down,
    name: '20260510_111445',
  },
  {
    up: migration_20260510_auth_fields.up,
    down: migration_20260510_auth_fields.down,
    name: '20260510_auth_fields',
  },
  {
    up: migration_20260516_064610_add_media_image_sizes.up,
    down: migration_20260516_064610_add_media_image_sizes.down,
    name: '20260516_064610_add_media_image_sizes',
  },
  {
    up: migration_20260516_072830_add_alerted_at.up,
    down: migration_20260516_072830_add_alerted_at.down,
    name: '20260516_072830_add_alerted_at',
  },
  {
    up: migration_20260516_143030.up,
    down: migration_20260516_143030.down,
    name: '20260516_143030',
  },
  {
    up: migration_20260516_153000_add_order_notify_emails.up,
    down: migration_20260516_153000_add_order_notify_emails.down,
    name: '20260516_153000_add_order_notify_emails',
  },
  {
    up: migration_20260516_180000_carts_and_order_submission_id.up,
    down: migration_20260516_180000_carts_and_order_submission_id.down,
    name: '20260516_180000_carts_and_order_submission_id',
  },
  {
    up: migration_20260516_190000_carts_locked_docs_rels.up,
    down: migration_20260516_190000_carts_locked_docs_rels.down,
    name: '20260516_190000_carts_locked_docs_rels',
  },
  {
    up: migration_20260516_210000_addresses.up,
    down: migration_20260516_210000_addresses.down,
    name: '20260516_210000_addresses',
  },
  {
    up: migration_20260516_220000_search_logs_summary.up,
    down: migration_20260516_220000_search_logs_summary.down,
    name: '20260516_220000_search_logs_summary'
  },
  {
    up: migration_20260517_030000_add_media_hero_size.up,
    down: migration_20260517_030000_add_media_hero_size.down,
    name: '20260517_030000_add_media_hero_size',
  },
  {
    up: migration_20260523_add_product_documents.up,
    down: migration_20260523_add_product_documents.down,
    name: '20260523_add_product_documents',
  },
  {
    up: migration_20260523_add_settings_contact_emails.up,
    down: migration_20260523_add_settings_contact_emails.down,
    name: '20260523_add_settings_contact_emails',
  },
  {
    up: migration_20260523_create_missing_tables.up,
    down: migration_20260523_create_missing_tables.down,
    name: '20260523_create_missing_tables',
  },
  {
    up: migration_20260523_shibuya_v2_redesign.up,
    down: migration_20260523_shibuya_v2_redesign.down,
    name: '20260523_shibuya_v2_redesign',
  },
  {
    up: migration_20260523_add_locked_docs_rels.up,
    down: migration_20260523_add_locked_docs_rels.down,
    name: '20260523_add_locked_docs_rels',
  },
  {
    up: migration_20260523_rewire_home_and_why_coolman_globals.up,
    down: migration_20260523_rewire_home_and_why_coolman_globals.down,
    name: '20260523_rewire_home_and_why_coolman_globals',
  },
  {
    up: migration_20260523_add_heritage_page_global.up,
    down: migration_20260523_add_heritage_page_global.down,
    name: '20260523_add_heritage_page_global',
  },
  {
    up: migration_20260523_fix_heritage_page_array_ids.up,
    down: migration_20260523_fix_heritage_page_array_ids.down,
    name: '20260523_fix_heritage_page_array_ids',
  },
  {
    up: migration_20260524_add_settings_new_fields.up,
    down: migration_20260524_add_settings_new_fields.down,
    name: '20260524_add_settings_new_fields',
  },
  {
    up: migration_20260524_add_settings_missing_columns.up,
    down: migration_20260524_add_settings_missing_columns.down,
    name: '20260524_add_settings_missing_columns',
  },
  {
    up: migration_20260524_add_login_attempts.up,
    down: migration_20260524_add_login_attempts.down,
    name: '20260524_add_login_attempts',
  },
  {
    up: migration_20260614_add_product_family.up,
    down: migration_20260614_add_product_family.down,
    name: '20260614_add_product_family',
  },
  {
    up: migration_20260615_add_product_variant_axis.up,
    down: migration_20260615_add_product_variant_axis.down,
    name: '20260615_add_product_variant_axis',
  },
  {
    up: migration_20260621_add_pages_navigation.up,
    down: migration_20260621_add_pages_navigation.down,
    name: '20260621_add_pages_navigation',
  },
];
