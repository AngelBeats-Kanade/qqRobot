"use strict"
import { segment } from "oicq"
import { bot } from "./index"
import { pixivAppApi } from "pixiv-app-api"

const pixiv = new pixivAppApi("2445743081@qq.com", "xtjjim123!", {
    camelcaseKeys: true,
})

bot.on("message", function (e) {
    if (e.raw_message.startsWith("来一张色图")) {
        ; (async () => {
            await pixiv.login()
            const json = await pixiv.searchIllust('艦これ10000users入り')
            e.reply(
                [
                    segment.at(e.user_id, '@' + e.sender.nickname, false),
                    segment.image(json.illusts[0].imageUrls.large)
                ]
            )
        })()
    }
})