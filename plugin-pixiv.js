"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const fetch = require("node-fetch")

bot.on("message", function (e) {
    if (e.raw_message === "来一张色图") {
        fetch('https://api.lolicon.app/setu/v2?tag=萝莉|少女&tag=白丝|黑丝&r18=0')
            .then(function (data) {
                return data.json()
            }).then(function (data) {
                var reply = `色图来了！嘿嘿嘿～
                             作者：${data["data"][0]["author"]}
                             title：${data["data"][0]["title"]}
                             pid：${data["data"][0]["pid"]}
                             r18：${data["data"][0]["r18"]}
                             链接：${data["data"][0]["urls"]["original"]}`
                e.reply(
                    [
                        "" + reply
                    ]
                )
                e.reply(
                    [
                        segment.image(data["data"][0]["urls"]["original"])
                    ]
                )
            })
    }
})

bot.on("message", function (e) {
    if (e.raw_message.startsWith("来一张色图 ")) {
        var tags = e.raw_message.substr(6)
        var r18 = "&r18=0"
        if (tags.search("r18") != -1) {
            r18 = "&r18=1"
        }
        var url = 'https://api.lolicon.app/setu/v2?tag=' + tags + r18
        fetch(url)
            .then(function (data) {
                return data.json()
            }).then(function (data) {
                var reply = `色图来了！嘿嘿嘿～
                             作者：${data["data"][0]["author"]}
                             title：${data["data"][0]["title"]}
                             pid：${data["data"][0]["pid"]}
                             r18：${data["data"][0]["r18"]}
                             链接：${data["data"][0]["urls"]["original"]}`
                e.reply(
                    [
                        "" + reply
                    ]
                )
                e.reply(
                    [
                        segment.image(data["data"][0]["urls"]["original"])
                    ]
                )
            })
    }
})

