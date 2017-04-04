var builder = require('botbuilder');
var luis = require('./luis');

exports.create = function (bot) {

    var local = null;
    var phoneNum = null;

    bot.dialog('trash', [
        function (session, args, next) {
            builder.Prompts.text(session, '쓰레기 문제로 불편을 겪고 계시는군요.\n\n' 
                + '[쓰레기 수거일 안내]\n\n'
                + '[쓰레기 무단 투기 신고 안내] 중에서\n\n'
                + '원하시는 내용을 말씀해주시면\n\n'
                + '자세히 안내를 해드릴께요.\n\n'
                + "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results, next) {
            var res = results.response;
            console.log("res : " + res);
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('trash');
                } else if (res.indexOf("수거일") != -1) {
                    session.beginDialog('trashDay');
                } else if (res.indexOf("신고") != -1) {
                    session.beginDialog('trashReport');
                } else {
                    session.beginDialog('trash');
                }
            }
        }
    ]);

    bot.dialog('trashDay', [
        function (session,args,next) {
            builder.Prompts.text(session, "쓰레기 수거일이 궁금하시군요.\n\n 정확한 수거일 안내를 위해 위치하신  위치하신 지역을 '동' 이름까지 말씀해주시면  안내해드리도록 하겠습니다.\n\n"
                + "다시 들으시려면, '다시'라고 말씀해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            var intent;
            var entity;
            console.log("res : " + res);
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('trashDay');
                } else {
                    local = res;
                    session.beginDialog('trashArea');
                    /*
                    return luis.query(res)
                        .then(luisResult => {
                            intent = luisResult.topScoringIntent.intent;
                            entity = luisResult.entities[0].entity;

                            if (entity != null) {
                                local = entity;
                                return session.beginDialog('trashArea');
                            }
                        })
                        .catch(err => {
                            return session.beginDialog('other');
                        });
                    */
                }
            }
        }
    ]);

    bot.dialog('trashReport', [
        function (session) {
            builder.Prompts.text(session, "쓰레기 무단 투기 신고 안내 입니다. \n\n 쓰레기 무단 투기 신고는 국번없이 128번으로 전화하셔서 신고를 하시면 됩니다.\n\n 신고 내용은 누가, 언제, 어디서, 무슨 쓰레기를 버렸는지 알 수 있도록 알려주시면 됩니다.\n\n"
                + "보다 자세한 내용을 원하시면 사용하시는 휴대폰 번호를 말씀하시거나 입력해주세요.\n\n휴대폰 문자로 신고 안내 내용이 있는 홈페이지   주소를 보내드리겠습니다.\n\n"
                + "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('trashReport');
                } else {
                    phoneNum = res;
                    session.beginDialog('trashReportNum');
                }
            }
        }
    ]);

    bot.dialog('trashArea', [
        function (session, args, next) {
            session.send('부산시 %s 지역이시군요.\n\n' +
                '위치하신 지역의 쓰레기 수거일은 매주 월요일, 수요일, 금요일 입니다.\n\n 쓰레기는 깨끗한 거리 환경 조성을 위해 일몰 후부터 쓰레기 종량제 봉투에 담아 배출하시면 지정 시간에 수거를 합니다. ', local);
            builder.Prompts.text(session, "다시 들으시려면, '다시' 궁금증이 해결되었으면 '해결' 이라고 말씀해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('trashArea');
                } else if (res == '해결') {
                    session.beginDialog('solution');
                } else {
                    session.beginDialog('other');
                }
            }
        }
    ]);

    bot.dialog('trashReportNum', [
        function (session, args, next) {
            session.send("말씀하신 전화번호는 %s 입니다. \n\n 번호가 맞으면 '전송' 이라고 말씀해주세요. \n\n 신고 안내 내용을 바로 보내드리겠습니다.", phoneNum);
            builder.Prompts.text(session, "번호가 틀렸으면 다시 번호를 말씀하시거나 입력해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res != '전송') {
                    phoneNum = res;
                    session.beginDialog('trashReportNum');
                } else {
                    session.beginDialog('trashReportNumTrans');
                }
            }
        }
    ]);

    bot.dialog('trashReportNumTrans', [
        function (session, args, next) {
            session.send("말씀하신 전화번호 %s으로 쓰레기 무단 투기 신고 관련 안내 내용을 보내드렸습니다.", phoneNum);
            session.beginDialog('solution');
        }
    ]);

}