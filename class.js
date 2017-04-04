var builder = require('botbuilder');
var luis = require('./luis');

exports.create = function (bot) {

    var phoneNum = null;

    bot.dialog('class', [
        function (session, args, next) {
            builder.Prompts.text(session, "문화교실에 대한 정보가 궁금하시군요. \n\n 문화교실은 3개월 과정, 연4기로 운영되며,   1,4,7,10월에 개강을 합니다. \n\n  정규반, 숙련반, 야간특강반이 있으며,  부산시 거주 만 18세 이상이면 수강이 가능  합니다. \n\n 숙련반의 경우 정규반을 수료한 이후   수강이 가능합니다.  ");
                + "\n\n접수방법이 궁금하시면 '접수방법'이라고 말씀해주세요."
                + "\n\n다시 들으시려면, '다시'라고 말씀해주세요"
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('class');
                } else if (res.indexOf("접수방법") != -1) {
                    session.beginDialog('classReceipt');
                } else {
                    session.beginDialog('class');
                }
            }
        }
    ]);

    bot.dialog('classReceipt', [
        function (session) {
            builder.Prompts.text(session, "접수방법은 3,6,9,12월 첫째주 3일간 접수가 이루어지며, 전 과면 1세대 1인 1과목만 신청이 가능합니다.\n\n"
                + "문화교실에 대한 보다 자세한 내용을 원하시면  휴대폰 번호를 말씀하시거나 입력해주세요. \n\n휴대폰 문자로 자세한 정보가 있는 홈페이지  주소를 보내드리겠습니다. \n\n"
                + "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('classReceipt');
                } else {
                    phoneNum = res;
                    session.beginDialog('classReceiptNum');
                }
            }
        }
    ]);

    bot.dialog('classReceiptNum', [
        function (session, args, next) {
            session.send("말씀하신 전화번호는 %s 입니다.   \n\n번호가 맞으면 '전송' 이라고 말씀해주세요.   \n\n문화교실 정보 홈페이지 주소를  바로 보내드리겠습니다.", phoneNum);
            builder.Prompts.text(session, "번호가 틀렸으면 다시 번호를 말씀하시거나 입력해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res != '전송') {
                    phoneNum = res;
                    session.beginDialog('classReceiptNum');
                } else {
                    session.beginDialog('classReceiptNumTrans');
                }
            }
        }
    ]);

    bot.dialog('classReceiptNumTrans', [
        function (session, args, next) {
            session.send("말씀하신 전화번호 %s으로 문화교실 정보 사이트 주소를 보내드렸습니다.", phoneNum);
            session.beginDialog('solution');
        }
    ]);

}