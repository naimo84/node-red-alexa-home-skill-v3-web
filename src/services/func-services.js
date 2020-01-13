///////////////////////////////////////////////////////////////////////////
// Depends
///////////////////////////////////////////////////////////////////////////
var Account = require('../models/account');
var logger = require('../loaders/logger');
var Acls = require('../models/acls');
var Topics = require('../models/topics');
///////////////////////////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////////////////////////
// Add supplied string as new array item to user.activeServices
const updateUserServices = async(username, applicationName) => {
    try {
        await Account.updateOne({username: username}, { $addToSet: {activeServices: applicationName}});
        logger.log('verbose', '[Services] Added service: ' + applicationName + ' to activeServices for user:' + username);
    }
    catch(e) {
        logger.log('error', '[Services] Unable to add service to activeServices, error:' + e.stack);
    }
}
// Remove supplied string as new array item to user.activeServices
const removeUserServices = async(username, applicationName) => {
    try {
        await Account.updateOne({username: username}, { $pull: {activeServices: applicationName} });
        logger.log('verbose', '[Services] Removed service: ' + applicationName + ' from activeServices for user:' + username);
    }
    catch(e) {
        logger.log('error', '[Services] Unable to remove service from activeServices, error:' + e.stack);
    }
}
// Create a new MQTT ACL object for mosquitto-go-auth plugin
const createACL = async(pattern) => {
	try{
		var acl = await Acls.findOne({topic: pattern.toString()});
		if (!acl) {
			var topic = new Acls({topic: pattern.toString(), acc: 3});
			await topic.save();
            logger.log('debug' , "[Topics] Created command pattern-based MQTT topic: " + JSON.stringify(topic));
            return topic;
        }
        else {
            logger.log('debug' , "[Topics] Skipped create MQTT topic, already exists: " + pattern);
            return acl;
        }
	}
	catch(e) {
        logger.log('error' , "[Topics] Unable to save command pattern-based MQTT topic, error: " + e.stack);
        return undefined;
	}
}

// Async function for password reset
const resetPassword = async(username, password) => {
	try {
		// Find related user
		var account = await Account.findOne({username: username});
		// Set password
		await account.setPassword(password);
		// Save Account
		await account.save();
		// Get updated user object, returning hash/ salt for use in PBKDF2 MQTT password
		var account = await Account.findByUsername(username, true);
		logger.log('debug', "[Change Password] Account hash: " + account.hash + ", account salt: " + account.salt);
		if (!account.salt || account.salt == undefined || !account.hash || account.hash == undefined){
			logger.log('error', "[Change Password] Unable to set MQTT password, hash / salt unavailable!");
			return false;
		}
		// Set MQTT Password
		var mqttPass = "PBKDF2$sha512$25000$" + account.salt + "$" + account.hash;
		account.mqttPass = mqttPass;
		account.password = mqttPass;
		// Save Account
		await account.save();
		// Return Success
		logger.log('verbose', "[Change Password] Changed password for: " + account.username);
		return true;
	}
	catch(e) {
		logger.log('error', "[Change Password] Unable to change password for user, error: " + e);
		return false;
	}
}

// Create/ modify the MQTT superuser account
const setupServiceAccount = async(username, password) => {
	try{
		// Check Super User account exists
		var account = await Account.findOne({username: username});
		// Super User Account does not exist, create it
		if (!account) {
			logger.log('info', "[App] Superuser MQTT account not found, creating account: " + username);
			account = await Account.register(new Account({username: username, email: '', password: '', mqttPass: '', superuser: true, active: true, isVerified: true}),password);
			// Generate MQTT topics/ ACL for Super User Account
			var topics = new Topics({topics: [
				'command/' +account.username+'/#',
				'state/' + account.username + '/#',
				'response/' + account.username + '/#',
				'message/' + account.username + '/#'
			]});
			// Save topics/ ACL
			await topics.save();
			// Detect if account salt not returned by Account.register() helper function, if not use findByUsername to return/ this functionality is due to be removed form passport-local-mongoose
			if (!account.hash || !account.salt || account.hash == undefined || account.salt == undefined) account = await Account.findByUsername(username, true);
			// Generate Super User MQTT password PBKDF2 hash
			var mqttPass = "PBKDF2$sha512$25000$" + account.salt + "$" + account.hash;
			// Update Super User account
			await Account.updateOne({username: account.username},{$set: {password: mqttPass, mqttPass: mqttPass, topics: topics._id}});
            logger.log('info' , "[App] Created MQTT superuser account!");
            return true;
		}
		// Super User account needs updates based upon historical release changes
		else if (account && !account.active && !account.isVerified) {
			// Update Super User account
			logger.log('info', "[App] Superuser MQTT found but needs updating, modifying account: " + username);
			await Account.updateOne({username: account.username},{$set: {isVerified: true, active: true}});
            logger.log('info' , "[App] Updated superuser MQTT account!");
            return true;
		}
		// Super User account found and configured correctly
		else {
			var result = await resetPassword(username, password);
			//logger.log('info', "[App] Superuser MQTT account, " + username + " already exists/ is configured correctly!");
			logger.log('warning', "[App] Reset Password for superuser MQTT account, " + username);
            return true;
		}
	}
	catch(e){
        logger.log('error', "[App] Superuser MQTT account, " + username + " configuration/ creation failed, error: " + e.stack);
        return false;
	}
}

module.exports = {
    updateUserServices,
    removeUserServices,
    createACL,
	setupServiceAccount,
	resetPassword
}