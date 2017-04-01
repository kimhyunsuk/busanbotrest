var builder = require('botbuilder');

exports.create = function (bot) {

    var phoneNum = null;
    var step = null;

    bot.dialog('employment', [
        function (session, args, next) {
            session.send("취업 지원에 대해 궁금하시군요. 시에서는 다양한 취업지원을 하고 있습니다.	[청년 취업 지원 사이트] 와  [중소기업 청년 인턴사업] 중에서  원하시는 내용을 말씀해주시면  자세히 안내를 해드릴께요.");
            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results, next) {
            var res = results.response;
            console.log("res : " + res);
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('employment');
                } else if (res.indexOf("사이트") != -1) {
                    session.beginDialog('employmentSite');
                } else if (res.indexOf("인턴사업") != -1) {
                    session.beginDialog('employmentBiz');
                } else {
                    session.beginDialog('employment');
                }
            }
        }
    ]);

    bot.dialog('employmentSite', [
        function (session, args, next) {
            session.send("청년 취업 지원 사이트가 궁금하시군요.  청년 취업 지원을 위해 '부산청년일자리센터'와  부산강소기업DB' 사이트를 운영하고 있습니다. 보다 자세한 내용을 원하시면 사용하시는	휴대폰 번호를 말씀하시거나 입력해주세요. 휴대폰 문자로 자세한 정보가 있는 홈페이지  주소를 보내드리겠습니다.");
            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('employmentSite');
                } else {
                    phoneNum = res;
                    step = 'employmentSite';
                    session.beginDialog('employmenNum');
                }
            }
        }
    ]);

    bot.dialog('employmentBiz', [
        function (session, args, next) {
            session.send("중소기업 청년 인턴사업이 궁금하시군요.  중소기업 청년 인턴사업은 중소기업의 청년  인턴제를 시행하여 청년실업 및 중소기업  인력난을 해소하는 사업입니다.	  보다 자세한 내용을 원하시면 사용하시는  휴대폰 번호를 말씀하시거나 입력해주세요.   휴대폰 문자로 자세한 정보가 있는 홈페이지   주소를 보내드리겠습니다.");
            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('employmentBiz');
                } else {
                    phoneNum = res;
                    step = 'employmentBiz';
                    session.beginDialog('employmenNum');
                }
            }
        }
    ]);

    bot.dialog('employmenNum', [
        function (session, args, next) {
            session.send("말씀하신 전화번호는 %s 입니다.   번호가 맞으면 '전송' 이라고 말씀해주세요.   신고 안내 내용을 바로 보내드리겠습니다.", phoneNum);
            builder.Prompts.text(session, "번호가 틀렸으면 다시 번호를 말씀하시거나 입력해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res != '전송') {
                    phoneNum = res;
                    session.beginDialog('employmenNum');
                } else {
                    if (step == 'employmentSite') {
                        session.beginDialog('employmentSiteTrans');
                    } else if (step == 'employmentBiz') {
                        session.beginDialog('employmentBizTrans');
                    } else {
                        session.beginDialog('other');
                    }
                }
            }
        }
    ]);

    bot.dialog('employmentSiteTrans', [
        function (session, args, next) {
            session.send("말씀하신 전화번호 %s으로 청년 취업 지원 사이트 주소 및 정보를 보내드렸습니다.", phoneNum);
            session.beginDialog('solution');
        }
    ]);

    bot.dialog('employmentBizTrans', [
        function (session, args, next) {
            session.send("말씀하신 전화번호 %s으로 중소기업 청년 인턴사업 사이트 주소 및 정보를 보내드렸습니다.", phoneNum);
            session.beginDialog('solution');
        }
    ]);

}
