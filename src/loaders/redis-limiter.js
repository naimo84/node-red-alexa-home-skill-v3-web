///////////////////////////////////////////////////////////////////////////
// Depends
///////////////////////////////////////////////////////////////////////////
const logger = require('./logger'); // Moved to own module
///////////////////////////////////////////////////////////////////////////
// Redis Client Config
///////////////////////////////////////////////////////////////////////////
const redisHost = process.env.REDIS_SERVER || 'redis';
// Note: limiter uses DB #0
const client = require('redis').createClient({
  url: `redis://${redisHost}:6379/0`,
  reconnectStrategy() {
    return 3000;
  },
});
client.on('connect', function () {
  logger.log('info', '[Redis:Limiter] Connecting to Redis server...');
});
client.on('ready', function () {
  logger.log('info', '[Redis:Limiter] Redis connection ready!');
});
client.on('reconnecting', function () {
  logger.log('info', '[Redis:Limiter] Attempting to reconnect to Redis server');
});
client.on('error', function (err) {
  logger.log('error', '[Redis:Limiter] Unable to connect to Redis server');
  console.log(err);
});

client.connect();

module.exports = client;
