"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const fetch = require("node-fetch")

bot.on("message", function (e) {
    if (e.raw_message === "来点二次元") {
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
                    var page = data["contents"][randomNumber]["illust_page_count"]
                    var reply = `色图来了！嘿嘿嘿～\n作者：${data["contents"][randomNumber]["user_name"]}\ntitle：${data["contents"][randomNumber]["title"]}\npid：${data["contents"][randomNumber]["user_id"]}\np站链接：https://www.pixiv.net/artworks/${data["contents"][randomNumber]["illust_id"]}\n国内直连链接：https://pixiv.re/${data["contents"][randomNumber]["illust_id"]}` + picture.substr(-4, 4)
                    if (page == 1) {
                        e.reply(
                            [
                                reply
                            ]
                        )
                        e.reply(
                            [
                                segment.image(`https://pixiv.cat/${data["contents"][randomNumber]["illust_id"]}` + picture.substr(-4, 4))
                            ]
                        )
                    } else {
                        reply = `色图来了！嘿嘿嘿～\n作者：${data["contents"][randomNumber]["user_name"]}\ntitle：${data["contents"][randomNumber]["title"]}\npid：${data["contents"][randomNumber]["user_id"]}\np站链接：https://www.pixiv.net/artworks/${data["contents"][randomNumber]["illust_id"]}\n国内直连链接：`
                        for (var i = 1; i <= page; i++) {
                            reply += `https://pixiv.re/${data["contents"][randomNumber]["illust_id"]}-${i}` + picture.substr(-4, 4)
                            reply += `\n`
                        }
                        e.reply(
                            [
                                reply
                            ]
                        )
                        for (var i = 1; i <= page; i++) {
                            e.reply(
                                [
                                    segment.image(`https://pixiv.cat/${data["contents"][randomNumber]["illust_id"]}-${i}` + picture.substr(-4, 4))
                                ]
                            )
                        }
                    }
                })
        })
    }

    if (e.raw_message === "来点色图") {
        var randomNumber = getRandomInt(1, 2)
        var url = `https://www.pixiv.net/ranking.php?mode=daily_r18&content=illust&p=${randomNumber}&format=json`
        fetch(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
                'referer': 'https://www.pixiv.net/ranking.php?mode=daily_r18&content=illust',
                'cookie': 'first_visit_datetime_pc=2021-09-28+15:52:57; p_ab_id=2; p_ab_id_2=3; p_ab_d_id=954436876; yuid_b=dHWVURA; device_token=50f27ce2596f15db46485386e2658f1b; privacy_policy_agreement=3; c_type=20; privacy_policy_notification=0; a_type=0; b_type=2; d_type=4,1; login_ever=yes; tag_view_ranking=liM64qjhwQ~uGQeWvelyQ~VqqXyMy80A~sYhl4SsLi1~RTJMXD26Ak~Z-FJ6AMFu8~EZQqoW9r8g~2R7RYffVfj~y9yFdNjFJo~MSNRmMUDgC~-98s6o2-Rp~hLwBbPEXzz~tgP8r-gOe_~qXzcci65nj~FDo7nPJEjf~8kCkoI701J~jH0uD88V6F~-sp-9oh8uv~i4Q_o7CyIB~eVxus64GZU~aKhT3n4RHZ~1Jc1EqM6Ff~jk9IzfjZ6n~0xsDLqCEW6~vMp-NoNmIL~QKeXYK2oSR~qWFESUmfEs~jsyFBENSMj~pvP44gGKdO~DADQycFGB0~PKOnf9fn03~jsuXqE_4cM~3WPZidqT9B~Ged1jLxcdL~WVrsHleeCL~Ie2c51_4Sp~ouiK2OKQ-A~DbUnfvXURp~C9_ZtBtMWU~gpglyfLkWs~SzTIWVCj2t~pWwa6Fh3R4~M0gtANhbpW~faHcYIP1U0~dJgU3VsQmO~NBK37t_oSE~Rq7EdadiWT~y8GNntYHsi~BU9SQkS-zU~fmZgEP1p5s~K8esoIs2eW~MHugbgF9Xo~So7otvWMNl~yPNaP3JSNF~4ZEPYJhfGu~fg8EOt4owo~FfFuZRxXNV~afM5Sp3Id1~b1s-xqez0Y~DpO7Lofslr~Lt-oEicbBr~F5CBR92p_Q~vti3o9ERHH~t9yCQU2bWx~55h6mysr_-~81BOcT1ZAV~R3lr4__Kr8~ILoPAjoYZ5~gooMLQqB9a~xZ6jtQjaj9~HY55MqmzzQ~ZRGAWQ4_eJ~ZZltVrbyeV~SkAFAh85DH~3gc3uGrU1V~E8vkum0JtI~AWJIXzMXQa~aMoljgmCaZ~kGYw4gQ11Z~QaiOjmwQnI~0rsCr94LAC~C1zxl77dvd~ThSueiucQX~o5DB__cIwt~nhVUm2hb1U~6GYRfMzuPl~UCT8y2nU0w~dGedGTSL3b~QTtzgGH2pR~_uueDi_8NC~VV3Uu--0IH~OZbzcrhaSe~l-nkIKv2D0~31XfoCHwdp~QliAD3l3jr~LLyDB5xskQ~TWrozby2UO~GOuKuI1rXg~MI2kUkwUjZ~w0A5rVRfvZ; __cf_bm=bmrKQhxY6ldMPGwdwGjc0aA1lFc.hHbO6M3qLOs9Gew-1634749480-0-AbPsFPrveyhtJAXJ2ZtVIW8GhZO8Pg1pzKmczdKLyu1XwnwkMZ5aGcfogcXVETkM1dEE/x0MrhG8MtYqX462TlzisrpMEkUsA5/PgOzyqOFMnM0IR2FOtdsk35+7mQ29vmanKdlHT1cfklkU7scX8GC6IrGnWtbRbqxEthD658RwhTHzMKluEuixtrqPbV358w==; PHPSESSID=24223512_EaWTPfyfrk5ZXfcqWCAiywocwa069bU1'
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
                    var page = data["contents"][randomNumber]["illust_page_count"]
                    var reply = `色图来了！嘿嘿嘿～\n作者：${data["contents"][randomNumber]["user_name"]}\ntitle：${data["contents"][randomNumber]["title"]}\npid：${data["contents"][randomNumber]["user_id"]}\np站链接：https://www.pixiv.net/artworks/${data["contents"][randomNumber]["illust_id"]}\n国内直连链接：https://pixiv.re/${data["contents"][randomNumber]["illust_id"]}` + picture.substr(-4, 4)
                    if (page == 1) {
                        e.reply(
                            [
                                reply
                            ]
                        )
                        e.reply(
                            [
                                segment.image(`https://pixiv.cat/${data["contents"][randomNumber]["illust_id"]}` + picture.substr(-4, 4))
                            ]
                        )
                    } else {
                        reply = `色图来了！嘿嘿嘿～\n作者：${data["contents"][randomNumber]["user_name"]}\ntitle：${data["contents"][randomNumber]["title"]}\npid：${data["contents"][randomNumber]["user_id"]}\np站链接：https://www.pixiv.net/artworks/${data["contents"][randomNumber]["illust_id"]}\n国内直连链接：`
                        for (var i = 1; i <= page; i++) {
                            reply += `https://pixiv.re/${data["contents"][randomNumber]["illust_id"]}-${i}` + picture.substr(-4, 4)
                            reply += `\n`
                        }
                        e.reply(
                            [
                                reply
                            ]
                        )
                        for (var i = 1; i <= page; i++) {
                            e.reply(
                                [
                                    segment.image(`https://pixiv.cat/${data["contents"][randomNumber]["illust_id"]}-${i}` + picture.substr(-4, 4))
                                ]
                            )
                        }
                    }
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