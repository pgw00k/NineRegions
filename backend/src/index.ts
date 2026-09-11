process.title = 'nine-regions-backend';

process.on('uncaughtException', (e) => {
  // eslint-disable-next-line no-console
  console.error('[uncaughtException]', e);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledRejection]', e);
  process.exit(1);
});

import { main } from './server';

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});