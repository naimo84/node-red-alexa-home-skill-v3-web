///////////////////////////////////////////////////////////////////////////
// Depends
///////////////////////////////////////////////////////////////////////////
var dotenv = require('dotenv').config();
// var http = require('http');
// var https = require('https');
var logger = require('./loaders/logger');
///////////////////////////////////////////////////////////////////////////
// Main
///////////////////////////////////////////////////////////////////////////
// Validate dotenv was successful
if (dotenv.error) {
	logger.log('error',"[Core] dotenv parsing failed, please ensure you have mapped .env file to /usr/src/app/.env, an example file is provided, see .env.template for more information");
	throw dotenv.error;
}
var app = require('./app');
// Validate CRITICAL environment variables passed to container
if (!(process.env.MONGO_USER && process.env.MONGO_PASSWORD && process.env.MQTT_USER && process.env.MQTT_PASSWORD && process.env.MQTT_PORT)) {
	logger.log('error',"[Core] You MUST supply MONGO_USER, MONGO_PASSWORD, MQTT_USER, MQTT_PASSWORD and MQTT_PORT environment variables");
	process.exit();
}
// Validate BRAND environment variables passed to container
if (!(process.env.BRAND)) {
	logger.log('error',"[Core] You MUST supply BRAND environment variable");
	process.exit();
}
// Warn on not supply of MONGO/ MQTT host names
if (!(process.env.MONGO_HOST && process.env.MQTT_URL)) {
	logger.log('warn',"[Core] Using 'mongodb' for Mongodb and 'mosquitto' for MQTT service endpoints, no MONGO_HOST/ MQTT_URL environment variable supplied");
}
// Warn on not supply of MAIL username/ password/ server
if (!(process.env.MAIL_SERVER && process.env.MAIL_USER && process.env.MAIL_PASSWORD)) {
	logger.log('warn',"[Core] No MAIL_SERVER/ MAIL_USER/ MAIL_PASSWORD environment variable supplied. System generated emails will generate errors");
}
// Warn on SYNC_API not being specified/ request SYNC will be disabled
if (!(process.env.HOMEGRAPH_APIKEY)){
	logger.log('warn',"[Core] No HOMEGRAPH_APIKEY environment variable supplied. New devices, removal or device changes will not show in users Google Home App without this");
}
// NodeJS App Settings
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');
// Express Settings
if (process.env.VCAP_APPLICATION) {
	var application = JSON.parse(process.env.VCAP_APPLICATION);
	var app_uri = application['application_uris'][0];
	app_id = 'https://' + app_uri;
}
else {
	//var app_id = 'http://localhost:' + port;
	var app_uri = (process.env.WEB_HOSTNAME || 'localhost');
	var app_id = 'https://' + app_uri;
}
// Create HTTP Server, to be proxied
var server = app.listen(port, function(){
	logger.log('info', "[Core] App listening on: " + host + ":" + port);
	logger.log('info', "[Core] App_ID -> " + app_id);
});
// Set timeout to 5 seconds
server.setTimeout = 5000;