"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")

var jsonObj = {}

setInterval(function () {
    var date = new Date()
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (h === 0 && m === 0 && s === 0)
        jsonObj = {}
}, 0)

bot.on("message", function (e) {
    if (e.raw_message === ".rd")
        e.reply(
            [
                segment.at(e.user_id, '@' + e.sender.nickname, false),
                " " + getRandomIntInclusive(1, 100)
            ]
        )
})

bot.on("message", function (e) {
    if (e.raw_message === ".jrrp") {
        var name = e.sender.nickname

        if (!(name in jsonObj)) {
            var num = getRandomIntInclusive(1, 100)
            jsonObj[name] = num + ""

            e.reply(
                [
                    segment.at(e.user_id, '@' + e.sender.nickname, false),
                    " 今天的运气：" + num
                ]
            )
        } else {
            e.reply(
                [
                    segment.at(e.user_id, '@' + e.sender.nickname, false),
                    " 今天的运气：" + jsonObj[name]
                ]
            )
        }
    }
})

bot.on("message", function (e) {
    if (e.raw_message.startsWith(".rd "))
        e.reply(
            [
                segment.at(e.user_id, '@' + e.sender.nickname, false),
                " " + getRandomIntInclusive(1, parseInt(e.raw_message.replace(/[^0-9]/ig, "")))
            ]
        )
})

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}