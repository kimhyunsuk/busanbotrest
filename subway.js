var builder = require('botbuilder');
var luis = require('./luis');

exports.create = function (bot) {

    var phoneNum = null;

    bot.dialog('subway', [
        function (session, args, next) {
            builder.Prompts.text(session, "대중교통에서 물건을 분실하셨군요.\n\n정말로 안타깝게 생각합니다.\n\n우선 대중교통에서 습득된 유실물은 각 교통  수단별 유실물 관리소를 통해 확인 후 본인   인계가 이루어지는데,\n\n 인계가 어려워질 경우  경찰서로 인계되어 14일간 게시, 1년간 보관을 하게 됩니다.\n\n"
                + "물건을 분실하신 곳이 도시철도가 맞으신가요? \n\n 맞으시면 '네' 라고 말씀해주시고요, 틀리면 대중교통 종류를 다시 말씀해주세요. \n\n 대중교통 종류는 시내버스, 도시철도, 마을버스, 법인택시, 개인택시 중에서 말씀해주시기   바라며, 그 외 경찰청 분실물 센터로 연결을 원하시면 '경찰청'이라고 말씀해주세요\n\n"
                + "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results, next) {
            var res = results.response;
            console.log("res : " + res);
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('subway');
                } else if (res.indexOf("네") != -1) {
                    session.beginDialog('subwayPlace');
                } else {
                    session.beginDialog('subway');
                }
            }
        }
    ]);

    bot.dialog('subwayPlace', [
        function (session) {
            builder.Prompts.text(session, "물건 분실 장소로 도시철도를 선택하셨습니다.\n\n 도시철도의 유실물 관리는 부산교통공사이며,  전화번호는 640-7339 입니다.\n\n바로 전화연결을 원하시면 '전화연결'이라고  말씀을 해주세요. \n\n 문자로 각 유실물 센터의 전화번호를 받아보고  싶으시면 휴대폰 번호를 입력해주세요.\n\n"
                + "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('subwayNum');
                } else {
                    phoneNum = res;
                    session.beginDialog('subwayPlaceNum');
                }
            }
        }
    ]);

    bot.dialog('subwayPlaceNum', [
        function (session, args, next) {
            session.send("말씀하신 전화번호는 %s 입니다. \n\n 번호가 맞으면 '전송' 이라고 말씀해주세요. \n\n 신고 안내 내용을 바로 보내드리겠습니다.", phoneNum);
            builder.Prompts.text(session, "번호가 틀렸으면 다시 번호를 말씀하시거나 입력해주세요.");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res != '전송') {
                    phoneNum = res;
                    session.beginDialog('subwayPlaceNum');
                } else {
                    session.beginDialog('subwayPlaceNumTrans');
                }
            }
        }
    ]);

    bot.dialog('subwayPlaceNumTrans', [
        function (session, args, next) {
            session.send("말씀하신 전화번호 %s으로 각 교통수단 유실물센터 전화번호를 보내드렸습니다.", phoneNum);
            session.beginDialog('solution');
        }
    ]);
}
