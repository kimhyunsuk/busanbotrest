var restify = require('restify');
var builder = require('botbuilder');
var express = require('express');
var request = require('request');
var greeting = require('./greeting');
var cat = require('./cat');
var trash = require('./trash');
var employment = require('./employment');
var classroom = require('./class');
var child = require('./child');
var subway = require('./subway');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
var botenv = process.env.BOT_ENV;
server.listen(process.env.port || process.env.PORT || 3978, function () {
//server.listen(3978, function () {
console.log('%s listening to %s (%s)', server.name, server.url, botenv);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
    //appId: '608800dd-78ff-4ca9-b03f-468ab616acb2',
    //appPassword: 'zoiQPdzGCFL2RciT8We2XD0'
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

//=========================================================
// Bots Dialogs
//=========================================================


greeting.create(bot);
cat.create(bot);
trash.create(bot);
employment.create(bot);
classroom.create(bot);
child.create(bot);
subway.create(bot);

var app = express();
var fs = require('fs');

app.listen(3303, function () { 
	console.log('Server Start .');
});

app.get('/', function (req, res) {
	fs.readFile('index.html', function (error, data) {
		if (error) {
			console.log(error);
		} else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		} 
	});
});
