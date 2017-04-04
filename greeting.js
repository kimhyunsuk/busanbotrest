var builder = require('botbuilder');
var luis = require('./luis');

exports.create = function (bot) {

    var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d702153b-695f-4994-85f8-a90d71b8b95f?subscription-key=7489b95cf3fb4797939ea70ce94a4b11");
    bot.recognizer(recognizer);
    var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

    bot.dialog('/', dialog);

    dialog.onDefault(session => {
        session.beginDialog('greeting');
    });

    bot.dialog('greeting', [
        function (session, args, next) {
            session.send("안녕하세요!!! \n\n 사람과 기술, 문화로 융성하는 부산입니다.\n\n 저는 부산시의 챗봇'부사니'입니다.\n\n 생활 관련 궁금 사항은 무엇이든 언제든지 저에게 물어보세요!");
            session.beginDialog('start');
        }
    ]);

    /*
    dialog.matches('Command', [
        function (session, args, next) {
            var start = builder.EntityRecognizer.findEntity(args.entities, '명령');

            if (start != null) {
                var command = start.entity
                switch (command) {
                    case '시 작':
                        if (command == '시 작') {
                            session.send("어떤 사항이 궁금하신가요? \n 내용을 직접 말씀해주시면 분석 후 안내해드릴게요");
                            session.send("또한, 챗봇 이용 중 상담원과 직접 대화를 원하시면 언제든지'상담원호출'이라고 말씀해주세요");
                            session.send("그럼, 궁금하신 사항을 말씀해주세요.");
                        } else {
                            session.beginDialog('start');
                        }
                        break;
                    case '다 시':
                        if (global.title == 'cat') {
                            if (global.dialogName == 'catReport') {
                                session.beginDialog('catReport');
                            } else if (global.dialogName == 'catNeutral') {
                                session.beginDialog('catNeutral');
                            } else if (global.dialogName == 'catArea') {
                                session.beginDialog('catArea');
                            }
                        } else if (global.title == 'trash') {
                            if (global.dialogName == 'trashArea') {
                                session.beginDialog('trashArea');
                            } else if (global.dialogName == 'trashDay') {
                                session.beginDialog('trashDay');
                            } else {
                                session.beginDialog('trash');
                            }
                        }
                        break;
                    case '전 송':
                        if (global.title == 'trash') {
                            if (global.dialogName == 'trashReportNum') {
                                console.log(global.dialogName);
                                session.beginDialog('trashReportNumTrans');
                            }
                        }
                        break;
                    case '해 결':
                        session.beginDialog('solution');
                        break;
                    case '종 료':
                        session.send("만족스러운 안내가 되셨나요? 부산 시민분들의 행복을 위해 언제나 최선을 다하는 챗봇 '부사니' 였습니다.");
                        session.send("앞으로도 궁금하신 사항이 있으시면 언제든지 저를 찾아주세요. 그럼 오늘도 행복한 하루 되세요. 감사합니다.");
                        session.endDialog();
                        break;
                    default:
                        break;
                }
            }
        }
    ]);

    dialog.matches('AreaRes', [
        function (session, args, next) {
            var area = builder.EntityRecognizer.findEntity(args.entities, '지역구');
            console.log(global.title);
            if (global.title != null) {
                switch (global.title) {
                    case 'cat':
                        global.local = area.entity;
                        session.beginDialog('catArea');
                        break;
                    case 'trash':
                        global.local = area.entity;
                        session.beginDialog('trashArea');
                        break;
                    case 'employment':
                        break;
                }
            }
        }
    ]);

    dialog.matches('PhoneNum', [
        function (session, args, next) {
            var num = builder.EntityRecognizer.findEntity(args.entities, '전화번호');

            if (global.title != null) {
                switch (global.title) {
                    case 'trash':
                        global.num = num.entity;
                        session.beginDialog('trashReportNum');
                        break;
                }
            }
        }
    ]);

    */


    

    bot.dialog('start', [
        function (session,args,next) {
            builder.Prompts.text(session, "챗봇을 시작하시려면 '시작' 하고 말씀해주세요.");
        },
        function (session, results, next) {
            var start = results.response;
            if (start != null) {
                if (start == '시작') {
                    session.beginDialog('startMessage');
                } else {
                    session.beginDialog('start');
                }
            }
        }
    ]);

    bot.dialog('startMessage', [
        function (session, args, next) {
            session.send("어떤 사항이 궁금하신가요? \n 내용을 직접 말씀해주시면 분석 후 안내해드릴게요");
            session.send("또한, 챗봇 이용 중 상담원과 직접 대화를 원하시면 언제든지'상담원호출'이라고 말씀해주세요");
            builder.Prompts.text(session, "그럼, 궁금하신 사항을 말씀해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            var intent;
            var entity;
            var begin;
            if (res != null) {
                return luis.query(res)
                    .then(luisResult => {
                        intent = luisResult.topScoringIntent.intent;
                        entity = luisResult.entities[0].entity;
                        //const entity = luisResult.entities.;
                        //entity = Object.keys(luisResult.entities).length;
                        //console.log(`processing resolved intent: ${intent}`);
                        //console.log(`greeting : ` + luisResult.entities[0].type);
                        //console.log('entity : ' + luisResult.entities[0].entity);
                        // collect missing fields

                        switch (entity) {
                            case '고 양 이':
                                begin = 'cat';
                                break;
                            case '쓰 레 기':
                                begin = 'trash';
                                break;
                            case '취 업':
                                begin = 'employment';
                                break;
                            case '문 화 교 실':
                                begin = 'class';
                                break;
                            case '아 이 돌 봄':
                                begin = 'child';
                                break;
                            case '전 철':
                                begin = 'subway';
                                break;
                            default:
                                begin = 'other';
                                break;
                        }

                        return session.beginDialog(begin);
                    }).catch(err => {
                        return session.beginDialog('startMessage');
                    });

            }
        }
    ]);


    bot.dialog('solution', [
        function (session, args, next) {
            session.send("궁금하신 내용에 대해 해결이 되셨군요! 또 다른 궁금하신 사항이 있으시면 다시 내용을 말씀해주세요.");
            session.send("또한, 챗봇과의 통화를 종료하시려면 '종료' 라고 말씀하시거나 전화를 끊으시면 됩니다.");
            next();
        }
    ]);



    dialog.matches('QnA', [
        function (session, args, next) {
            var subject = builder.EntityRecognizer.findEntity(args.entities, '제목');
            //builder.DialogAction.send(subject.entity);

            if (subject != null) {
                console.log(subject.entity);
                switch (subject.entity) {
                    case '고 양 이':
                        session.beginDialog('cat');
                        break;
                    case '쓰 레 기':
                        session.beginDialog('trash');
                        break;
                    case '취 업':
                        session.beginDialog('employment');
                        break;
                    case '문 화 교 실':
                        session.beginDialog('class');
                        break;
                    case '아 이 돌 봄':
                        session.beginDialog('child');
                        break;
                    case '전 철':
                        session.beginDialog('subway');
                        break;
                    default:
                        session.beginDialog('other');
                        break;
                }
            } else {
                session.beginDialog('other');
            }
        }
    ]);

    dialog.matches('Command', [
        function (session, args, next) {
            var start = builder.EntityRecognizer.findEntity(args.entities, '명령');

            if (start != null) {
                var command = start.entity
                switch (command) {
                    case '종 료':
                        session.send("만족스러운 안내가 되셨나요? 부산 시민분들의 행복을 위해 언제나 최선을 다하는 챗봇 '부사니' 였습니다.");
                        session.send("앞으로도 궁금하신 사항이 있으시면 언제든지 저를 찾아주세요. 그럼 오늘도 행복한 하루 되세요. 감사합니다.");
                        session.endDialog();
                        break;
                    default:
                        break;
                }
            }
        }
    ]);



    bot.dialog('other', [
        function (session, args, next) {
            session.send('질문에 응답 할수 없습니다. 000-000-0000 으로 전화바랍니다.');
            next();
        }
    ]);
    
}

