export default () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
  logLevel: process.env.LOG_LEVEL,
  disableLogs: process.env.DISABLE_LOGS === '1',
  swapiUrl: process.env.SWAPI_URL,
  swapiProxyUrl: process.env.SWAPI_PROXY_URL,
});
