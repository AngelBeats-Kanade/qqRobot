"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const fetch = require("node-fetch")

bot.on("message", function (e) {
    if (e.raw_message === "来一张色图") {
        fetch('https://api.lolicon.app/setu/v2?tag=萝莉|少女&tag=白丝|黑丝')
            .then(function (data) {
                return data.json()
            }).then(function (data) {
                e.reply(
                    [
                        "色图来了！嘿嘿嘿～",
                        data["data"][0]["urls"]["original"]
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
        if (tags.search("r18")) {
            tags = tags.replace("r18", "")
            tags = tags + "&r18=1"
        }
        var url = 'https://api.lolicon.app/setu/v2?tag=' + tags
        fetch(url)
            .then(function (data) {
                return data.json()
            }).then(function (data) {
                e.reply(
                    [
                        "色图来了！嘿嘿嘿～",
                        data["data"][0]["urls"]["original"]
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

