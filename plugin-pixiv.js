"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const fetch = require("node-fetch")

var dailyNumberCollection = {}
var dailyTagCollection = {}
var dailyNumberR18Collection = {}
var dailyTagR18Collection = {}
var dailyPictures = {}
var dailyR18Pictures = {}

setInterval(fetchData, 60000)
fetchData()

bot.on("message", function (e) {
    if (e.raw_message === "来点二次元") {
        getDailyPicture(e, false)
    }

    if (e.raw_message === "来点色图") {
        getDailyPicture(e, true)
    }

    if (e.raw_message.startsWith("来点二次元 ")) {
        var tags = e.raw_message.substr(6)
        if (tags.replace(/[0-9]/ig, '') === '') {
            tags = parseInt(tags)
            var page = Math.trunc(tags / 50) + 1
            var number = tags % 50

            getDailyPictureByNumber(e, false, page, number)
        } else {
            getDailyPictureByTag(e, false, tags)
        }
    }

    if (e.raw_message.startsWith("来点色图 ")) {
        var tags = e.raw_message.substr(5)
        if (tags.replace(/[0-9]/ig, '') === '') {
            tags = parseInt(tags)
            var page = Math.trunc(tags / 50) + 1
            var number = tags % 50

            getDailyPictureByNumber(e, 'daily_r18', page, number)
        } else {
            getDailyPictureByTag(e, true, tags)
        }
    }

    if (e.raw_message === '阿米娅，告诉我怎么用tag搜索' || e.raw_message === '.help tag') {
        e.reply(`刀客塔，阿米娅的tag搜索有两种方式。第一种是直接输入tag（仅支持单独tag），实例：“来点二次元 明日方舟”；第二种是输入数字，数字代表的是该图片在p站日榜的排名，实例：“来点二次元 1”，即代表取p站日榜第一名的图片。非r18搜索支持1~500名，r18搜索支持1~100名。`)
    }
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDailyPicture(e, r18) {
    var randomPage = r18 ? getRandomInt(1, 2) : getRandomInt(1, 10)
    var randomNumber = getRandomInt(0, 49)

    getDailyPictureByNumber(e, r18, randomPage, randomNumber)
}

function getDailyPictureByNumber(e, r18, page, number) {
    var rank = ((page - 1) * 50 + number).toString()
    var title = r18 ? dailyNumberR18Collection[rank] : dailyNumberCollection[rank]

    fetchAPictureAndReply(title, r18, e)
}

function getDailyPictureByTag(e, r18, tag) {
    var tagCollection = r18 ? dailyTagR18Collection : dailyTagCollection
    if (tag in tagCollection) {
        var randomNumber = getRandomInt(0, tagCollection[tag].length - 1)
        var title = tagCollection[tag][randomNumber]

        fetchAPictureAndReply(title, r18, e)
    } else {
        var randomPage = getRandomInt(1, 10)
        var url = r18 ? `https://www.pixiv.net/ajax/search/artworks/${tag}?word=${tag}&order=date_d&mode=r18&p=${randomPage}&s_mode=s_tag&type=all` : `https://www.pixiv.net/ajax/search/artworks/${tag}?word=${tag}&order=date_d&mode=all&p=${randomPage}&s_mode=s_tag&type=all`
        fetch(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
                'referer': 'https://www.pixiv.net/ranking.php?mode=daily&content=illust',
                'cookie': 'first_visit_datetime_pc=2021-09-28+15:52:57; p_ab_id=2; p_ab_id_2=3; p_ab_d_id=954436876; yuid_b=dHWVURA; device_token=50f27ce2596f15db46485386e2658f1b; privacy_policy_agreement=3; c_type=20; privacy_policy_notification=0; a_type=0; b_type=2; d_type=4,1; login_ever=yes; tag_view_ranking=liM64qjhwQ~uGQeWvelyQ~VqqXyMy80A~sYhl4SsLi1~RTJMXD26Ak~Z-FJ6AMFu8~EZQqoW9r8g~2R7RYffVfj~y9yFdNjFJo~MSNRmMUDgC~-98s6o2-Rp~hLwBbPEXzz~tgP8r-gOe_~qXzcci65nj~FDo7nPJEjf~8kCkoI701J~jH0uD88V6F~-sp-9oh8uv~i4Q_o7CyIB~eVxus64GZU~aKhT3n4RHZ~1Jc1EqM6Ff~jk9IzfjZ6n~0xsDLqCEW6~vMp-NoNmIL~QKeXYK2oSR~qWFESUmfEs~jsyFBENSMj~pvP44gGKdO~DADQycFGB0~PKOnf9fn03~jsuXqE_4cM~3WPZidqT9B~Ged1jLxcdL~WVrsHleeCL~Ie2c51_4Sp~ouiK2OKQ-A~DbUnfvXURp~C9_ZtBtMWU~gpglyfLkWs~SzTIWVCj2t~pWwa6Fh3R4~M0gtANhbpW~faHcYIP1U0~dJgU3VsQmO~NBK37t_oSE~Rq7EdadiWT~y8GNntYHsi~BU9SQkS-zU~fmZgEP1p5s~K8esoIs2eW~MHugbgF9Xo~So7otvWMNl~yPNaP3JSNF~4ZEPYJhfGu~fg8EOt4owo~FfFuZRxXNV~afM5Sp3Id1~b1s-xqez0Y~DpO7Lofslr~Lt-oEicbBr~F5CBR92p_Q~vti3o9ERHH~t9yCQU2bWx~55h6mysr_-~81BOcT1ZAV~R3lr4__Kr8~ILoPAjoYZ5~gooMLQqB9a~xZ6jtQjaj9~HY55MqmzzQ~ZRGAWQ4_eJ~ZZltVrbyeV~SkAFAh85DH~3gc3uGrU1V~E8vkum0JtI~AWJIXzMXQa~aMoljgmCaZ~kGYw4gQ11Z~QaiOjmwQnI~0rsCr94LAC~C1zxl77dvd~ThSueiucQX~o5DB__cIwt~nhVUm2hb1U~6GYRfMzuPl~UCT8y2nU0w~dGedGTSL3b~QTtzgGH2pR~_uueDi_8NC~VV3Uu--0IH~OZbzcrhaSe~l-nkIKv2D0~31XfoCHwdp~QliAD3l3jr~LLyDB5xskQ~TWrozby2UO~GOuKuI1rXg~MI2kUkwUjZ~w0A5rVRfvZ; __cf_bm=bmrKQhxY6ldMPGwdwGjc0aA1lFc.hHbO6M3qLOs9Gew-1634749480-0-AbPsFPrveyhtJAXJ2ZtVIW8GhZO8Pg1pzKmczdKLyu1XwnwkMZ5aGcfogcXVETkM1dEE/x0MrhG8MtYqX462TlzisrpMEkUsA5/PgOzyqOFMnM0IR2FOtdsk35+7mQ29vmanKdlHT1cfklkU7scX8GC6IrGnWtbRbqxEthD658RwhTHzMKluEuixtrqPbV358w==; PHPSESSID=24223512_EaWTPfyfrk5ZXfcqWCAiywocwa069bU1'
            }
        }).then(data => data.json())
            .then(function (data) {
                var head = r18 ? '色图来了！嘿嘿嘿～' : '二次元图片来了！'
                let picture = ''
                let title = ''
                let url = ''
                let page = ''
                let uid = ''
                let id = ''
                let user = ''
                let tags = ''
                let temp = 0
                let promiseArr = []
                for (let j = 0; j < 50; j++) {
                    let p = new Promise((resolve, reject) => {
                        fetch(`https://www.pixiv.net/artworks/${data["body"]["illustManga"]["data"][j]["id"]}`)
                            .then(data => data.text())
                            .then(function (text) {
                                let bookMark = parseInt(text.match(/"bookmarkCount":(.+?),"likeCount"/)[1])
                                if (bookMark > temp) {
                                    if (!r18 && (data["body"]["illustManga"]["data"][j]["tags"].indexOf('R-18') != -1 || data["body"]["illustManga"]["data"][j]["tags"].indexOf('R-18G') != -1)) { } else {
                                        temp = bookMark
                                        picture = text.match(/"original":"(.+?)"},"tags"/)[1]
                                        title = data["body"]["illustManga"]["data"][j]["title"]
                                        url = `https://www.pixiv.net/artworks/${data["body"]["illustManga"]["data"][j]["id"]}`
                                        page = data["body"]["illustManga"]["data"][j]["pageCount"]
                                        uid = data["body"]["illustManga"]["data"][j]["userId"]
                                        id = data["body"]["illustManga"]["data"][j]["id"]
                                        user = data["body"]["illustManga"]["data"][j]["userName"]
                                        tags = data["body"]["illustManga"]["data"][j]["tags"]
                                    }
                                }
                                resolve()
                            })
                    })
                    promiseArr.push(p)
                }
                Promise.all(promiseArr).then(res => {
                    if (page === 1) {
                        let reply = `${head}\n作者：${user}\nuid：${uid}\ntitle：${title}\ntags：${tags}\np站链接：${url}\n国内直连链接：https://pixiv.re/${id}` + picture.substr(-4, 4)
                        e.reply(
                            [
                                reply
                            ]
                        )
                        e.reply(
                            [
                                segment.image(`https://pixiv.cat/${id}` + picture.substr(-4, 4))
                            ]
                        ).then(function (results) {
                            if (r18) {
                                setTimeout(function () {
                                    bot.deleteMsg(results["data"]["message_id"])
                                }, 10000)
                            }
                        })
                    } else {
                        let reply = `${head}\n作者：${user}\nuid：${uid}\ntitle：${title}\ntags：${tags}\np站链接：${url}\n国内直连链接：`
                        for (var i = 1; i <= page; i++) {
                            reply += `https://pixiv.re/${id}-${i}` + picture.substr(-4, 4)
                            reply += `\n`
                        }
                        e.reply(
                            [
                                reply
                            ]
                        )
                        for (var i = 1; i <= (page <= 5 ? page : 5); i++) {
                            e.reply(
                                [
                                    segment.image(`https://pixiv.cat/${id}-${i}` + picture.substr(-4, 4))
                                ]
                            ).then(function (results) {
                                if (r18)
                                    setTimeout(function () {
                                        bot.deleteMsg(results["data"]["message_id"])
                                    }, 10000)
                            })
                        }
                    }
                })
            })
    }
}

function fetchAPictureAndReply(title, r18, e) {
    var url = r18 ? dailyR18Pictures[title]["url"] : dailyPictures[title]["url"]
    fetch(url)
        .then(text => text.text())
        .then(function (text) {
            var picture = text.match(/"original":"(.+?)"},"tags"/)[1]
            var head = r18 ? '色图来了！嘿嘿嘿～' : '二次元图片来了！'
            var page = r18 ? dailyR18Pictures[title]["pages"] : dailyPictures[title]["pages"]
            var uid = r18 ? dailyR18Pictures[title]["uid"] : dailyPictures[title]["uid"]
            var id = r18 ? dailyR18Pictures[title]["id"] : dailyPictures[title]["id"]
            var user = r18 ? dailyR18Pictures[title]["user"] : dailyPictures[title]["user"]
            var tags = r18 ? dailyR18Pictures[title]["tags"] : dailyPictures[title]["tags"]
            var reply = `${head}\n作者：${user}\nuid：${uid}\ntitle：${title}\ntags：${tags}\np站链接：${url}\n国内直连链接：https://pixiv.re/${id}` + picture.substr(-4, 4)
            if (page === '1') {
                e.reply(
                    [
                        reply
                    ]
                )
                e.reply(
                    [
                        segment.image(`https://pixiv.cat/${id}` + picture.substr(-4, 4))
                    ]
                ).then(function (results) {
                    if (r18) {
                        setTimeout(function () {
                            bot.deleteMsg(results["data"]["message_id"])
                        }, 10000)
                    }
                })
            } else {
                reply = `${head}\n作者：${user}\nuid：${uid}\ntitle：${title}\ntags：${tags}\np站链接：${url}\n国内直连链接：`
                for (var i = 1; i <= page; i++) {
                    reply += `https://pixiv.re/${id}-${i}` + picture.substr(-4, 4)
                    reply += `\n`
                }
                e.reply(
                    [
                        reply
                    ]
                )
                for (var i = 1; i <= (page <= 5 ? page : 5); i++) {
                    e.reply(
                        [
                            segment.image(`https://pixiv.cat/${id}-${i}` + picture.substr(-4, 4))
                        ]
                    )
                        .then(function (results) {
                            if (r18)
                                setTimeout(function () {
                                    bot.deleteMsg(results["data"]["message_id"])
                                }, 10000)
                        })
                }
            }
        })
}

function fetchDataByRandomTag(randomTag, r18) {
    let randomTagCollection = []
    for (let i = 1; i <= 10; i++) {
        let url = r18 ? `https://www.pixiv.net/ajax/search/artworks/${randomTag}?word=${randomTag}&order=date_d&mode=r18&p=${i}&s_mode=s_tag&type=all` : `https://www.pixiv.net/ajax/search/artworks/${randomTag}?word=${randomTag}&order=date_d&mode=all&p=${i}&s_mode=s_tag&type=all`
        fetch(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
                'referer': 'https://www.pixiv.net/ranking.php?mode=daily&content=illust',
                'cookie': 'first_visit_datetime_pc=2021-09-28+15:52:57; p_ab_id=2; p_ab_id_2=3; p_ab_d_id=954436876; yuid_b=dHWVURA; device_token=50f27ce2596f15db46485386e2658f1b; privacy_policy_agreement=3; c_type=20; privacy_policy_notification=0; a_type=0; b_type=2; d_type=4,1; login_ever=yes; tag_view_ranking=liM64qjhwQ~uGQeWvelyQ~VqqXyMy80A~sYhl4SsLi1~RTJMXD26Ak~Z-FJ6AMFu8~EZQqoW9r8g~2R7RYffVfj~y9yFdNjFJo~MSNRmMUDgC~-98s6o2-Rp~hLwBbPEXzz~tgP8r-gOe_~qXzcci65nj~FDo7nPJEjf~8kCkoI701J~jH0uD88V6F~-sp-9oh8uv~i4Q_o7CyIB~eVxus64GZU~aKhT3n4RHZ~1Jc1EqM6Ff~jk9IzfjZ6n~0xsDLqCEW6~vMp-NoNmIL~QKeXYK2oSR~qWFESUmfEs~jsyFBENSMj~pvP44gGKdO~DADQycFGB0~PKOnf9fn03~jsuXqE_4cM~3WPZidqT9B~Ged1jLxcdL~WVrsHleeCL~Ie2c51_4Sp~ouiK2OKQ-A~DbUnfvXURp~C9_ZtBtMWU~gpglyfLkWs~SzTIWVCj2t~pWwa6Fh3R4~M0gtANhbpW~faHcYIP1U0~dJgU3VsQmO~NBK37t_oSE~Rq7EdadiWT~y8GNntYHsi~BU9SQkS-zU~fmZgEP1p5s~K8esoIs2eW~MHugbgF9Xo~So7otvWMNl~yPNaP3JSNF~4ZEPYJhfGu~fg8EOt4owo~FfFuZRxXNV~afM5Sp3Id1~b1s-xqez0Y~DpO7Lofslr~Lt-oEicbBr~F5CBR92p_Q~vti3o9ERHH~t9yCQU2bWx~55h6mysr_-~81BOcT1ZAV~R3lr4__Kr8~ILoPAjoYZ5~gooMLQqB9a~xZ6jtQjaj9~HY55MqmzzQ~ZRGAWQ4_eJ~ZZltVrbyeV~SkAFAh85DH~3gc3uGrU1V~E8vkum0JtI~AWJIXzMXQa~aMoljgmCaZ~kGYw4gQ11Z~QaiOjmwQnI~0rsCr94LAC~C1zxl77dvd~ThSueiucQX~o5DB__cIwt~nhVUm2hb1U~6GYRfMzuPl~UCT8y2nU0w~dGedGTSL3b~QTtzgGH2pR~_uueDi_8NC~VV3Uu--0IH~OZbzcrhaSe~l-nkIKv2D0~31XfoCHwdp~QliAD3l3jr~LLyDB5xskQ~TWrozby2UO~GOuKuI1rXg~MI2kUkwUjZ~w0A5rVRfvZ; __cf_bm=bmrKQhxY6ldMPGwdwGjc0aA1lFc.hHbO6M3qLOs9Gew-1634749480-0-AbPsFPrveyhtJAXJ2ZtVIW8GhZO8Pg1pzKmczdKLyu1XwnwkMZ5aGcfogcXVETkM1dEE/x0MrhG8MtYqX462TlzisrpMEkUsA5/PgOzyqOFMnM0IR2FOtdsk35+7mQ29vmanKdlHT1cfklkU7scX8GC6IrGnWtbRbqxEthD658RwhTHzMKluEuixtrqPbV358w==; PHPSESSID=24223512_EaWTPfyfrk5ZXfcqWCAiywocwa069bU1'
            }
        }).then(data => data.json())
            .then(function (data) {
                let promiseArr = []
                for (let n = 0; n < 50; n++) {
                    let p = new Promise((resolve, reject) => {
                        dailyPictures[data["contents"][n]["title"]] = {}
                        dailyPictures[data["contents"][n]["title"]]["url"] = `https://www.pixiv.net/artworks/${data["contents"][n]["illust_id"]}`
                        dailyPictures[data["contents"][n]["title"]]["user"] = data["contents"][n]["user_name"]
                        dailyPictures[data["contents"][n]["title"]]["uid"] = data["contents"][n]["user_id"]
                        dailyPictures[data["contents"][n]["title"]]["id"] = data["contents"][n]["illust_id"]
                        dailyPictures[data["contents"][n]["title"]]["pages"] = data["contents"][n]["illust_page_count"]
                        dailyPictures[data["contents"][n]["title"]]["tags"] = data["contents"][n]["tags"]
                        dailyNumberCollection[data["contents"][n]["rank"]] = data["contents"][n]["title"]
                        let tags = data["contents"][n]["tags"]
                        for (let j = 0; j < tags.length; j++) {
                            if (!(tags[j] in dailyTagCollection))
                                dailyTagCollection[tags[j]] = []
                            dailyTagCollection[tags[j]].push(data["contents"][n]["title"])
                        }
                        resolve()
                    })
                    promiseArr.push(p)
                }
            })
    }
    return randomTagCollection
}

function fetchData() {
    for (var i = 1; i <= 10; i++) {
        var url = `https://www.pixiv.net/ranking.php?mode=daily&content=illust&p=${i}&format=json`
        fetch(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
                'referer': 'https://www.pixiv.net/ranking.php?mode=daily&content=illust',
                'cookie': 'first_visit_datetime_pc=2021-09-28+15:52:57; p_ab_id=2; p_ab_id_2=3; p_ab_d_id=954436876; yuid_b=dHWVURA; device_token=50f27ce2596f15db46485386e2658f1b; privacy_policy_agreement=3; c_type=20; privacy_policy_notification=0; a_type=0; b_type=2; d_type=4,1; login_ever=yes; tag_view_ranking=liM64qjhwQ~uGQeWvelyQ~VqqXyMy80A~sYhl4SsLi1~RTJMXD26Ak~Z-FJ6AMFu8~EZQqoW9r8g~2R7RYffVfj~y9yFdNjFJo~MSNRmMUDgC~-98s6o2-Rp~hLwBbPEXzz~tgP8r-gOe_~qXzcci65nj~FDo7nPJEjf~8kCkoI701J~jH0uD88V6F~-sp-9oh8uv~i4Q_o7CyIB~eVxus64GZU~aKhT3n4RHZ~1Jc1EqM6Ff~jk9IzfjZ6n~0xsDLqCEW6~vMp-NoNmIL~QKeXYK2oSR~qWFESUmfEs~jsyFBENSMj~pvP44gGKdO~DADQycFGB0~PKOnf9fn03~jsuXqE_4cM~3WPZidqT9B~Ged1jLxcdL~WVrsHleeCL~Ie2c51_4Sp~ouiK2OKQ-A~DbUnfvXURp~C9_ZtBtMWU~gpglyfLkWs~SzTIWVCj2t~pWwa6Fh3R4~M0gtANhbpW~faHcYIP1U0~dJgU3VsQmO~NBK37t_oSE~Rq7EdadiWT~y8GNntYHsi~BU9SQkS-zU~fmZgEP1p5s~K8esoIs2eW~MHugbgF9Xo~So7otvWMNl~yPNaP3JSNF~4ZEPYJhfGu~fg8EOt4owo~FfFuZRxXNV~afM5Sp3Id1~b1s-xqez0Y~DpO7Lofslr~Lt-oEicbBr~F5CBR92p_Q~vti3o9ERHH~t9yCQU2bWx~55h6mysr_-~81BOcT1ZAV~R3lr4__Kr8~ILoPAjoYZ5~gooMLQqB9a~xZ6jtQjaj9~HY55MqmzzQ~ZRGAWQ4_eJ~ZZltVrbyeV~SkAFAh85DH~3gc3uGrU1V~E8vkum0JtI~AWJIXzMXQa~aMoljgmCaZ~kGYw4gQ11Z~QaiOjmwQnI~0rsCr94LAC~C1zxl77dvd~ThSueiucQX~o5DB__cIwt~nhVUm2hb1U~6GYRfMzuPl~UCT8y2nU0w~dGedGTSL3b~QTtzgGH2pR~_uueDi_8NC~VV3Uu--0IH~OZbzcrhaSe~l-nkIKv2D0~31XfoCHwdp~QliAD3l3jr~LLyDB5xskQ~TWrozby2UO~GOuKuI1rXg~MI2kUkwUjZ~w0A5rVRfvZ; __cf_bm=bmrKQhxY6ldMPGwdwGjc0aA1lFc.hHbO6M3qLOs9Gew-1634749480-0-AbPsFPrveyhtJAXJ2ZtVIW8GhZO8Pg1pzKmczdKLyu1XwnwkMZ5aGcfogcXVETkM1dEE/x0MrhG8MtYqX462TlzisrpMEkUsA5/PgOzyqOFMnM0IR2FOtdsk35+7mQ29vmanKdlHT1cfklkU7scX8GC6IrGnWtbRbqxEthD658RwhTHzMKluEuixtrqPbV358w==; PHPSESSID=24223512_EaWTPfyfrk5ZXfcqWCAiywocwa069bU1'
            }
        }).then(data => data.json())
            .then(function (data) {
                for (var n = 0; n < 50; n++) {
                    dailyPictures[data["contents"][n]["title"]] = {}
                    dailyPictures[data["contents"][n]["title"]]["url"] = `https://www.pixiv.net/artworks/${data["contents"][n]["illust_id"]}`
                    dailyPictures[data["contents"][n]["title"]]["user"] = data["contents"][n]["user_name"]
                    dailyPictures[data["contents"][n]["title"]]["uid"] = data["contents"][n]["user_id"]
                    dailyPictures[data["contents"][n]["title"]]["id"] = data["contents"][n]["illust_id"]
                    dailyPictures[data["contents"][n]["title"]]["pages"] = data["contents"][n]["illust_page_count"]
                    dailyPictures[data["contents"][n]["title"]]["tags"] = data["contents"][n]["tags"]
                    dailyNumberCollection[data["contents"][n]["rank"]] = data["contents"][n]["title"]
                    var tags = data["contents"][n]["tags"]
                    for (var j = 0; j < tags.length; j++) {
                        if (!(tags[j] in dailyTagCollection))
                            dailyTagCollection[tags[j]] = []
                        dailyTagCollection[tags[j]].push(data["contents"][n]["title"])
                    }
                }
            })
    }

    for (var i = 1; i <= 2; i++) {
        var url = `https://www.pixiv.net/ranking.php?mode=daily_r18&content=illust&p=${i}&format=json`
        fetch(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
                'referer': 'https://www.pixiv.net/ranking.php?mode=daily_r18&content=illust',
                'cookie': 'first_visit_datetime_pc=2021-09-28+15:52:57; p_ab_id=2; p_ab_id_2=3; p_ab_d_id=954436876; yuid_b=dHWVURA; device_token=50f27ce2596f15db46485386e2658f1b; privacy_policy_agreement=3; c_type=20; privacy_policy_notification=0; a_type=0; b_type=2; d_type=4,1; login_ever=yes; tag_view_ranking=liM64qjhwQ~uGQeWvelyQ~VqqXyMy80A~sYhl4SsLi1~RTJMXD26Ak~Z-FJ6AMFu8~EZQqoW9r8g~2R7RYffVfj~y9yFdNjFJo~MSNRmMUDgC~-98s6o2-Rp~hLwBbPEXzz~tgP8r-gOe_~qXzcci65nj~FDo7nPJEjf~8kCkoI701J~jH0uD88V6F~-sp-9oh8uv~i4Q_o7CyIB~eVxus64GZU~aKhT3n4RHZ~1Jc1EqM6Ff~jk9IzfjZ6n~0xsDLqCEW6~vMp-NoNmIL~QKeXYK2oSR~qWFESUmfEs~jsyFBENSMj~pvP44gGKdO~DADQycFGB0~PKOnf9fn03~jsuXqE_4cM~3WPZidqT9B~Ged1jLxcdL~WVrsHleeCL~Ie2c51_4Sp~ouiK2OKQ-A~DbUnfvXURp~C9_ZtBtMWU~gpglyfLkWs~SzTIWVCj2t~pWwa6Fh3R4~M0gtANhbpW~faHcYIP1U0~dJgU3VsQmO~NBK37t_oSE~Rq7EdadiWT~y8GNntYHsi~BU9SQkS-zU~fmZgEP1p5s~K8esoIs2eW~MHugbgF9Xo~So7otvWMNl~yPNaP3JSNF~4ZEPYJhfGu~fg8EOt4owo~FfFuZRxXNV~afM5Sp3Id1~b1s-xqez0Y~DpO7Lofslr~Lt-oEicbBr~F5CBR92p_Q~vti3o9ERHH~t9yCQU2bWx~55h6mysr_-~81BOcT1ZAV~R3lr4__Kr8~ILoPAjoYZ5~gooMLQqB9a~xZ6jtQjaj9~HY55MqmzzQ~ZRGAWQ4_eJ~ZZltVrbyeV~SkAFAh85DH~3gc3uGrU1V~E8vkum0JtI~AWJIXzMXQa~aMoljgmCaZ~kGYw4gQ11Z~QaiOjmwQnI~0rsCr94LAC~C1zxl77dvd~ThSueiucQX~o5DB__cIwt~nhVUm2hb1U~6GYRfMzuPl~UCT8y2nU0w~dGedGTSL3b~QTtzgGH2pR~_uueDi_8NC~VV3Uu--0IH~OZbzcrhaSe~l-nkIKv2D0~31XfoCHwdp~QliAD3l3jr~LLyDB5xskQ~TWrozby2UO~GOuKuI1rXg~MI2kUkwUjZ~w0A5rVRfvZ; __cf_bm=bmrKQhxY6ldMPGwdwGjc0aA1lFc.hHbO6M3qLOs9Gew-1634749480-0-AbPsFPrveyhtJAXJ2ZtVIW8GhZO8Pg1pzKmczdKLyu1XwnwkMZ5aGcfogcXVETkM1dEE/x0MrhG8MtYqX462TlzisrpMEkUsA5/PgOzyqOFMnM0IR2FOtdsk35+7mQ29vmanKdlHT1cfklkU7scX8GC6IrGnWtbRbqxEthD658RwhTHzMKluEuixtrqPbV358w==; PHPSESSID=24223512_EaWTPfyfrk5ZXfcqWCAiywocwa069bU1'
            }
        }).then(data => data.json())
            .then(function (data) {
                for (var n = 0; n < 50; n++) {
                    dailyR18Pictures[data["contents"][n]["title"]] = {}
                    dailyR18Pictures[data["contents"][n]["title"]]["url"] = `https://www.pixiv.net/artworks/${data["contents"][n]["illust_id"]}`
                    dailyR18Pictures[data["contents"][n]["title"]]["user"] = data["contents"][n]["user_name"]
                    dailyR18Pictures[data["contents"][n]["title"]]["uid"] = data["contents"][n]["user_id"]
                    dailyR18Pictures[data["contents"][n]["title"]]["id"] = data["contents"][n]["illust_id"]
                    dailyR18Pictures[data["contents"][n]["title"]]["pages"] = data["contents"][n]["illust_page_count"]
                    dailyR18Pictures[data["contents"][n]["title"]]["tags"] = data["contents"][n]["tags"]
                    dailyNumberR18Collection[data["contents"][n]["rank"]] = data["contents"][n]["title"]
                    var tags = data["contents"][n]["tags"]
                    for (var j = 0; j < tags.length; j++) {
                        if (!(tags[j] in dailyTagR18Collection))
                            dailyTagR18Collection[tags[j]] = []
                        dailyTagR18Collection[tags[j]].push(data["contents"][n]["title"])
                    }
                }
            })
    }
}