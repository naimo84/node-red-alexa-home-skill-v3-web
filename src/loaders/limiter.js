///////////////////////////////////////////////////////////////////////////
// Depends
///////////////////////////////////////////////////////////////////////////
const mqttClient = require('../loaders/mqtt').mqttClient;
const logger = require('../loaders/logger');
const client = require('../loaders/redis-limiter');
const Devices = require('../models/devices');
const rateLimit = require('express-rate-limit');
///////////////////////////////////////////////////////////////////////////
// Default Limiter, used on majority of routers ex. OAuth2-related and Command API
module.exports.defaultLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: function (req, res, next, options) {
    logger.log(
      'warn',
      '[Rate Limiter] Default rate-limit exceeded for path: ' +
        req.path +
        ', IP address: ' +
        req.ip
    );
    res.status(options.statusCode).send(options.message);
  },
});
// Restrictive Limiter, used to prevent abuse on NewUser, Login, 10 reqs/ hr
module.exports.restrictiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: function (req, res, next, options) {
    logger.log(
      'warn',
      '[Rate Limiter] Restrictive rate-limit exceeded for path: ' +
        req.path +
        ',  IP address:' +
        req.ip
    );
    res.status(options.statusCode).send(options.message);
  },
});
// GetState Limiter, uses specific param, 100 reqs/ hr
module.exports.getStateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 250, // 10 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => req.params['dev_id'],
  handler: (req, res, next, options) =>
    handleGetStateLimitReached(req, res, next, options),
});
// Handler for GetState
function handleGetStateLimitReached(req, res, next, options) {
  logger.log(
    'warn',
    '[Rate Limiter] GetState rate-limit exceeded for IP address: ' + req.ip
  );
  // MQTT message code, will provide client-side notification in Node-RED console
  var endpointId = req.params.dev_id || 0;
  if (endpointId != 0) {
    // New Redis hash-based lookup
    var strAlert;
    client.hGetAll(endpointId, function (err, object) {
      // No endpointId:username match in Redis, query MongoDB
      if (!err && object == undefined) {
        var pDevice = Devices.findOne({ endpointId: endpointId });
        Promise.all([pDevice]).then(([device]) => {
          var username = getSafe(() => device.username);
          if (username != undefined) {
            strAlert =
              '[' +
              device.friendlyName +
              '] ' +
              'API Rate limiter triggered. You will be unable to view state in Alexa App for up to 1 hour. Please refrain from leaving Alexa App open/ polling for extended periods, see wiki for more information.';
            // Add endpointId : username | friendlyName hash to Redis as its likely we'll get repeat hits!
            client.hSet(
              endpointId,
              'username',
              device.username,
              'deviceFriendlyName',
              device.friendlyName
            );
            notifyUser('warn', username, endpointId, strAlert);
          } else {
            logger.log(
              'warn',
              '[Rate Limiter] GetState rate-limit unable to lookup username'
            );
          }
        });
      }
      // Matched endpointId hash in Redis, saved MongoDB query
      else if (!err) {
        strAlert =
          '[' +
          object.deviceFriendlyName +
          '] ' +
          'API Rate limiter triggered. You will be unable to view state in Alexa App for up to 1 hour. Please refrain from leaving Alexa App open/ polling for extended periods, see wiki for more information.';
        notifyUser('warn', object.username, endpointId, strAlert);
      }
      // An error occurred on Redis client.get
      else {
        logger.log(
          'warn',
          '[Rate Limiter] Redis get failed with error: ' + err
        );
      }
    });
  } else {
    logger.log(
      'verbose',
      '[Rate Limiter] GetState rate-limit unable to lookup dev_id param'
    );
  }
  res.status(options.statusCode).send(options.message);
}

// Post MQTT message that users' Node-RED instance will display in GUI as warning
function notifyUser(severity, username, endpointId, message) {
  const topic = 'message/' + username + '/' + endpointId; // Prepare MQTT topic for client-side notifiations
  const alert = {
    severity,
    message,
  };
  try {
    mqttClient.publish(topic, JSON.stringify(alert));
    logger.log(
      'warn',
      '[Limiter] Published MQTT alert for user: ' +
        username +
        ' endpointId: ' +
        endpointId +
        ' message: ' +
        message
    );
  } catch (err) {
    logger.log('warn', '[Limiter] Failed to publish MQTT alert, error: ' + err);
  }
}
// Nested attribute/ element tester
function getSafe(fn) {
  try {
    return fn();
  } catch (e) {
    return undefined;
  }
}
