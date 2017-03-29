var builder = require('botbuilder');

exports.create = function (bot) {

    bot.dialog('/', [

        function (session) {
            session.send('안녕하세요!!! 부산광역시 민원센터입니다. 무엇을 도와드릴까요?');
        }
    ])
}

