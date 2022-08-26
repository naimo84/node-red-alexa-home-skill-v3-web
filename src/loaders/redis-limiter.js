///////////////////////////////////////////////////////////////////////////
// Depends
///////////////////////////////////////////////////////////////////////////
var logger = require('./logger'); // Moved to own module
///////////////////////////////////////////////////////////////////////////
// Redis Client Config
///////////////////////////////////////////////////////////////////////////
var redisHost = process.env.REDIS_SERVER || 'redis';
var client = require('redis').createClient({
    url: `redis://${redisHost}:6397/0`,
    // db: 0,
	retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
			return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
			//logger.log('error', "[REDIS] Retry time exhausted");
			return new Error('Retry time exhausted');
        }
        if (options.attempt > 100) {
			// End reconnecting with built in error
			logger.log('error', "[Redis] Redis server connection retry limit exhausted");
            return undefined;
        }
		// reconnect after
		//logger.log('error', "[REDIS] Attempting reconnection after set interval");
        return Math.min(options.attempt * 1000, 10000);
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