///////////////////////////////////////////////////////////////////////////
// Depends
///////////////////////////////////////////////////////////////////////////
var logger = require('./logger'); // Moved to own module
///////////////////////////////////////////////////////////////////////////
// Redis Client Config
///////////////////////////////////////////////////////////////////////////
var redisHost = process.env.REDIS_SERVER || 'redis';
var client = require('redis').createClient({
    url: `redis://${redisHost}:6379/0`,
    reconnectStrategy() {
        return 3000;
    }
});
client.on('connect', function() {
    logger.log('info', "[Redis] Connecting to Redis server...");
});
client.on('ready', function() {
    logger.log('info', "[Redis] Redis connection ready!");
});
client.on('reconnecting', function() {
    logger.log('info', "[Redis] Attempting to reconnect to Redis server");
});
client.on('error', function (err) {
    logger.log('error', "[Redis] Unable to connect to Redis server");
    console.log(err)
});

client.connect()

module.exports = client;