import { createRedisClient } from '../test/common';

async function main() {
  const redis = createRedisClient();
  redis.flushdb().then(() => {
    console.log('All keys in the current database have been deleted');
  });
  await redis.quit();
}

main();
