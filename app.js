var restify = require('restify');
var builder = require('botbuilder');
var express = require('express');

var request = require('request');

var luisEngServer = require('./LuisEnglishServer');
var luisKorServer = require('./LuisKoreanServer');
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
var botenv = process.env.BOT_ENV;
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s (%s)', server.name, server.url, botenv);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [

    function (session) {

        session.send("�ȳ�!! �� �����ڵ��� ê�� �θ��̾� !!");
        session.beginDialog('choiceLanguage');

    },
    function (session, results) {

        if (session.userData.language == 'English') {

            session.send("Your Choice Language : " + session.userData.language + "\n Your Name : " + session.userData.name + "\n Your Age : " + session.userData.age);
            session.send("OK.. Let`s Go " + session.userData.name);
            //luisEngServer.beginDialog(session); 


        } else if (session.userData.language == 'Korean') {

            session.send("����� ������ ��� : " + session.userData.language + " ����� �̸� : " + session.userData.name + " ����� ���ɴ� : " + session.userData.age);
            session.send("OK.. �θ��̸� �����غ����..!! " + session.userData.name + "��");
            //luisKorServer.beginDialog(session); 

        }
    }
]);


bot.dialog('choiceLanguage', [
         function (session) {
        // Prompt the user to select their preferred locale 
             builder.Prompts.choice(session, "Choose Your Language : ", 'English|Korean', { listStyle: builder.ListStyle.button });
        
    },
         function (session, results) {
            session.preferredLocale(results.response.entity, function (err) {
            if (!err) {
                session.send("Your Choice Language %s.", results.response.entity);
                session.userData.language = results.response.entity;
                if (results.response.entity == "English") {
                    session.beginDialog('/askNameEng');
                }
                else if (results.response.entity == "Korean") {
                    session.beginDialog('/askNameKor');
                }
            } else {
                    session.error(err);
            }
        }); 
     } 
]); 


bot.dialog('/askNameEng', [
    function (session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function (session, results) {
        session.send('Hello %s!', results.response);
        session.userData.name = results.response;
        session.beginDialog('/askAgeEng');
        //session.endDialog(results);
    }
]);


bot.dialog('/askNameKor', [
    function (session) {
        builder.Prompts.text(session, '����� �̸���?');
    },
    function (session, results) {
        session.send('�ȳ� %s!', results.response);
        session.userData.name = results.response;
        session.beginDialog('/askAgeKor');
        //session.endDialog(results);
    }
]);

bot.dialog('/askAgeEng', [
    function (session) {
        //builder.Prompts.text(session, 'What is your Age?');
        builder.Prompts.choice(session, 'What is your Age Group?', '10~20 AgeGroup|30 AgeGroup|40 AgeGroup|50 AgeGroup| 60 Over AgeGroup', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.send('Your AgeGroup :  %s!', results.response.entity);
        session.userData.age = results.response.entity;
        session.endDialog(results);
    }
]);


bot.dialog('/askAgeKor', [
    function (session) {
        builder.Prompts.choice(session, '����� ���ɴ��?', '10~20��|30��|40��|50��|60���̻�', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.send('����� ���ɴ�� : %s!', results.response.entity);
        session.userData.age = results.response.entity;
        session.endDialog(results);
    }
]);









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



//luisEngServer.create(bot);
//luisKorServer.create(bot);