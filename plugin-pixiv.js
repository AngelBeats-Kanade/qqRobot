"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const { pixiv } = require("./index")

bot.on("message", function (e) {
    if (e.raw_message.startsWith("来一张色图")) {
        ; (async () => {
            let res = await pixiv.login()
            const json = await pixiv.searchIllust('艦これ10000users入り')
            e.reply(
                [
                    segment.at(e.user_id, '@' + e.sender.nickname, false),
                    ' ' + res
                ]
            )
        })()
    }
})