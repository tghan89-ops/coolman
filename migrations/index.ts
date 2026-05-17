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
];
