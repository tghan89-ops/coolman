import * as migration_20260510_111445 from './20260510_111445';

export const migrations = [
  {
    up: migration_20260510_111445.up,
    down: migration_20260510_111445.down,
    name: '20260510_111445'
  },
];
