var builder = require('botbuilder');
var luis = require('./luis');

exports.create = function (bot) {

    bot.dialog('child', [
        function (session, args, next) {
            session.send("아이돌봄 지원사업에 대해 궁금하시군요	아이돌봄 지원사업은 돌봄이 필요한 가정에  아이돌봄 서비스를 제공함으로써 가족의  아동양육부담을 경감시키고 중장년 여성의  일자리 창출을 위한 사업입니다.  [시간제 돌봄 서비스]를 알고 싶으시면 '시간제',  [종일제 돌봄 서비스]를 알고 싶으시면 '종일제'  [기타 돌봄 서비스]를 알고 싶으시면 '기타'  라고 말씀을 해주세요.");
            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results, next) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('child');
                } else if (res.indexOf("종일제") != -1) {
                    session.beginDialog('childDay');
                } else {
                    session.beginDialog('child');
                }
            }
        }
    ]);

    bot.dialog('childDay', [
        function (session, args, next) {
            session.send("종일제 돌봄 서비스에 대해 알려드릴께요.	이용대상은 생후 만3개월에서 만36개월 이하  아동이 있는 가정이며, 지원 내용은 이유식,  기저귀 갈기, 목욕 등의 돌봄 서비스를 지원합니다.  정부지원 시간은 월120시간 이상부터 200시간  이하이며, 서비스 이용요금은 소득별 차등지원 되는 방식이기 때문에 유형별로 본인부담금 39만원부터 130만원 까지 입니다.  이용방법을 알고 싶으시면 '이용방법'  이전으로 돌아가시려면 '이전' 이라고   말씀해주세요.");
            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('childDay');
                } else if (res == '이용방법') {
                    session.beginDialog('childDayUse');
                } else if (res == '이전') {
                    session.beginDialog('child');
                }
            }
        }
    ]);

    bot.dialog('childDayUse', [
        function (session, args, next) {
            session.send("돌봄 서비스 이용방법이 궁금하시군요. 돌봄 서비스 이용은 건강가정지원센터 등 사업기관에 이용회원 등록하여 서비스 신청을  통해 이용이 가능합니다.");
            session.send(" 신청 관련 자세한 사항은 대표전화 1577- 2514  에서 평일 오전9시부터 오후6시까지 안내를  해드리고 있습니다.직접 전화를 원하시면 '전화연결'  ");
            session.send("처음으로 돌아가시려면 '처음'  다른 궁금사항이 있으시면 내용을 말씀해주세요.  ");
            builder.Prompts.text(session, "다시 들으시려면, '다시'라고 말씀해주세요");
        },
        function (session, results) {
            var res = results.response;
            if (res != null) {
                if (res == '다시') {
                    session.beginDialog('childDayUse');
                } else if (res == '전화연결') {
                    session.beginDialog('childDayConnect');
                } else if (res == '처음') {
                    session.beginDialog('child');
                }
            }
        }
    ]);

    bot.dialog('childDayConnect', [
        function (session, args, next) {
            session.send("건강가정지원센터 대표번호로 전화연결을 원하시는군요.  잠시 후 연결을 해드리도록 하겠습니다.   지금까지 만족스러운 안내가 되셨는지요?	  앞으로도 궁금하신 사항이 있으시면   언제든지 찾아주시기 바라며, 오늘도 행복한   하루 되세요.   그럼, 바로 전화를 연결해드리겠습니다.  감사합니다. ");
            next();
        }
    ]);
}