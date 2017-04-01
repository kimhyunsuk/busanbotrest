var builder = require('botbuilder');
var luis = require('./luis');

exports.create = function (bot) {

    var local = null;

    bot.dialog('cat', [
        function (session) {

            session.send("길고양이 문제로 불편을 겪고 계시는군요");
            session.send("[길고양이 신고]");
            session.send("[길고양이 중성화 안내] 중에서");
            session.send("원하시는 내용을 말씀해주시면 자세히 안내를 해드릴께요.");

            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
            global.title = 'cat';
        },
        function (session, results, next) {
            var res = results.response;
            console.log("res : " + res);
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('cat');
                } else if (res.indexOf("신고") != -1) {
                    session.beginDialog('catReport');
                } else if (res.indexOf("중성화") != -1) {
                    session.beginDialog('catNeutral');
                } else {
                    session.beginDialog('cat');
                }
            }
        }

    ]);

    bot.dialog('catReport', [
        function (session, args, next) {
            session.send("길고양이 신고가 궁금하시군요? 길고양이가 발견되는 대략적인 지역 주소를 말씀해주시면 담당 부처에서 실사 후 조치하도록 하겠습니다.");
            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results, next) {
            var res = results.response;
            var intent;
            var entity;
            console.log("res : " + res);
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('catReport');
                } else {
                    return luis.query(res)
                        .then(luisResult => {
                            intent = luisResult.topScoringIntent.intent;
                            entity = luisResult.entities[0].entity;
                            
                            if (entity != null) {
                                local = entity;
                                return session.beginDialog('catArea');
                            }
                        })
                        .catch(err => {
                            return session.beginDialog('other');
                        });
                }
            }
        }

    ]);

/*
    bot.dialog('catReport', [
        function (session, args, next) {
            session.send("길고양이 신고가 궁금하시군요? 길고양이가 발견되는 대략적인 지역 주소를 말씀해주시면 담당 부처에서 실사 후 조치하도록 하겠습니다.");
            session.send("다시 들으시려면, '다시'라고 말씀해주세요");
            global.dialogName = "catReport";
            next();
        }
    ]);
*/
    bot.dialog('catNeutral', [
        function (session, args, next) {
            session.send("길고양이 중성과 사업 안내를 해드리겠습니다. 본 사업은 길고양이를 포획하여 중성화수술 후 원래 자리에 풀어줌으로서 번식력을 낮춰 장기적으로 수를 줄어들게 하고");
            session.send("번식기 동안 울음소리를 사라지게 하여 시민들의 불펴을 줄여주는 사업입니다.");
            session.send("보다 자세한 내용은 '동물보호관리시스템' 홈페이지에서 확인하실 수 있습니다.");
            builder.Prompts.text(session, "다시 들으시려면, '다시' 궁금증이 해결되었으면 '해결'이라고 말씀해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('catNeutral');
                } else if (res == '해결') {
                    session.beginDialog('solution');
                } else {
                    session.beginDialog('other');
                }
            }
        }
    ]);

    bot.dialog('catArea', [
        function (session, args, next) {
            session.send('부산시 %s 지역이시군요. 해당 지역에 대한 실사를 2일 내에 실시 하겠으며, 포획되는 길고양이는 일정 기간 공고 후 입양 또는 중성화 조치됨을 알려드립니다.', local);
            builder.Prompts.text(session, "다시 들으시려면, '다시' 궁금증이 해결되었으면 '해결' 이라고 말씀해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('catArea');
                } else if (res == '해결') {
                    session.beginDialog('solution');
                } else {
                    session.beginDialog('other');
                }
            }
        }
    ]);

}