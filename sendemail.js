var fs = require("fs");
var ejs = require('ejs');
var path = require('path');
var nodemailer = require('nodemailer');

var smtpOptions = {
	host: process.env.MAIL_SERVER,
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD
	}
}

var lostPasswordTxtTemplate;
var lostPasswordHTMLTemplate;

fs.readFile(
	path.join(__dirname, 'views', 'email', 'resetPasswordText.ejs'),
	"utf-8",
	function(err, file){
		lostPasswordTxtTemplate = file;
	});


fs.readFile(
	path.join(__dirname, 'views', 'email', 'resetPasswordHTML.ejs'),
	"utf-8",
	function(err, file){
		lostPasswordHTMLTemplate = file;
	});

var transporter = nodemailer.createTransport(smtpOptions);

var Mailer = function() {

};

Mailer.prototype.send = function send(to, from, subject, text, html){
	var message = {
		to: to,
		from: from,
		subject: subject,
		text: text,
		html: html
	};

	transporter.sendMail(message, function(error, info){
		var dt = new Date().toISOString();
		if(error){
			return console.log("[" + dt + "] " + "[ERROR] Unable to send email ",error);
		}
		console.log("[" + dt + "] " + "[INFO] [Mail] EMail sent to: " + message.to + ", subject: " + message.subject, info.response);
	});
}

Mailer.prototype.buildLostPasswordBody = function buildLostBody(uuid, userid){
	var body = ejs.render(lostPasswordTxtTemplate, {uuid: uuid, username: userid});
	var htmlBody = ejs.render(lostPasswordHTMLTemplate, {uuid: uuid, username: userid});

	return {text: body, html: htmlBody };
}

module.exports = Mailer;