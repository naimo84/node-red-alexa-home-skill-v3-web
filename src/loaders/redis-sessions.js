///////////////////////////////////////////////////////////////////////////
// Depends
///////////////////////////////////////////////////////////////////////////
const logger = require('./logger'); // Moved to own module
///////////////////////////////////////////////////////////////////////////
// Redis Client Config
///////////////////////////////////////////////////////////////////////////
const redisHost = process.env.REDIS_SERVER || 'redis';
const { createClient} = require('redis')
// Note: Sessions use DB #1
const client = createClient({
    url: `redis://${redisHost}:6379/1`,
    legacyMode: true,
});
client.on('connect', function() {
    logger.log('info', "[Redis:Session] Connecting to Redis server...");
});
client.on('ready', function() {
    logger.log('info', "[Redis:Session] Redis connection ready!");
});
client.on('reconnecting', function() {
    logger.log('info', "[Redis:Session] Attempting to reconnect to Redis server");
});
client.on('error', function (err) {
    logger.log('error', "[Redis:Session] Unable to connect to Redis server");
    console.log(err)
});

client.connect().catch(console.error)

module.exports = client;