import * as migration_20260510_111445 from './20260510_111445';
import * as migration_20260510_auth_fields from './20260510_auth_fields';
import * as migration_20260516_064610_add_media_image_sizes from './20260516_064610_add_media_image_sizes';

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
    name: '20260516_064610_add_media_image_sizes'
  },
];
