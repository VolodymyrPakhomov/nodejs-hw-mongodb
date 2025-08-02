import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

//4 крок
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap().catch((error) => {
  console.error('Server initialization error:', error);
});
