"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const fetch = require("node-fetch")

bot.on("message", function (e) {
    if (e.raw_message === "来一张色图") {
        var randomNumber = getRandomInt(1, 10)
        var url = `https://www.pixiv.net/ranking.php?mode=daily&content=illust&p=${randomNumber}&format=json`
        fetch(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
                'referer': 'https://www.pixiv.net/ranking.php?mode=daily&content=illust'
            }
        }).then(function (data) {
            return data.json()
        }).then(function (data) {
            randomNumber = getRandomInt(1, 50)
            fetch(`https://www.pixiv.net/artworks/${data["contents"][randomNumber]["illust_id"]}`)
                .then(function (text) {
                    return text.text()
                }).then(function (text) {
                    var picture = text.match(/"original":"(.+?)"},"tags"/)[1]
                    var page = ``
                    if (data["contents"][randomNumber]["illust_page_count"] > 1)
                        page = `-1`
                    var reply = `色图来了！嘿嘿嘿～\n作者：${data["contents"][randomNumber]["user_name"]}\ntitle：${data["contents"][randomNumber]["title"]}\npid：${data["contents"][randomNumber]["user_id"]}\np站链接：https://www.pixiv.net/artworks/${data["contents"][randomNumber]["illust_id"]}\n国内直连链接：https://pixiv.re/${data["contents"][randomNumber]["illust_id"]}` + page + picture.substr(-4, 4)
                    e.reply(
                        [
                            reply
                        ]
                    )
                    e.reply(
                        [
                            segment.image(`https://pixiv.cat/${data["contents"][randomNumber]["illust_id"]}` + page + picture.substr(-4, 4))
                        ]
                    )
                })
        })
    }

    if (e.raw_message.startsWith("来一张色图 ")) {
        var tags = e.raw_message.substr(6)
        var r18 = "&r18=0"
        if (tags.search("r18") != -1) {
            r18 = "&r18=1"
            tags = tags.replace("|r18", "")
        }
        var url = 'https://api.lolicon.app/setu/v2?tag=' + tags + r18

        fetch(url)
            .then(function (data) {
                return data.json()
            }).then(function (data) {
                var reply = `色图来了！嘿嘿嘿～\n作者：${data["data"][0]["author"]}\ntitle：${data["data"][0]["title"]}\npid：${data["data"][0]["pid"]}\nr18：${data["data"][0]["r18"]}\n链接：${data["data"][0]["urls"]["original"]}`
                e.reply(
                    [
                        reply
                    ]
                )
                e.reply(
                    [
                        segment.image(data["data"][0]["urls"]["original"])
                    ]
                ).then(function (results) {
                    if (r18 === "&r18=1") {
                        setTimeout(function () {
                            bot.deleteMsg(results["data"]["message_id"])
                        }, 10000)
                    }
                })
            })
    }
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}