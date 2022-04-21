'use strict'
const { segment } = require('oicq')
const { bot } = require('./index')
const schedule = require('node-schedule')
const random = require('mockjs').Random
const fs = require('fs')

let dataJson = {}

const tarots = JSON.parse(fs.readFileSync('./resources/tarots.json'))

// setInterval(function () {
//     let date = new Date()
//     let h = date.getHours();
//     let m = date.getMinutes();
//     let s = date.getSeconds();
//     if (h === 0 && m === 0 && s === 0)
//         jsonObj = {}
// }, 0)

schedule.scheduleJob('cleanDataEveryDay', '000***', function () {
    dataJson = {}
})

bot.on('message', function (e) {
    if (e.raw_message === '.jrrp' || e.raw_message === '。jrrp') {
        const id = e.sender.user_id
        const name = e.sender.nickname
        const reply = onJrrp(name, dataJson)

        e.reply(
            [
                segment.at(id, name, false),
                reply
            ]
        )
    }

    if (e.raw_message === ".draw 单张塔罗牌" || e.raw_message === "。draw 单张塔罗牌") {
        const name = e.sender.nickname
        const id = e.sender.user_id
        const num = getRandomIntInclusive(0, 21)
        const position = getRandomIntInclusive(0, 1)
        const words = onTarots(num, position)

        e.reply(
            [
                segment.at(id, name, false),
                words
            ]
        )

        e.reply(
            [
                '' + tarots[num.toString()][position]
            ]
        )
    }

    if (e.raw_message.startsWith('.r ') || e.raw_message.startsWith('。r ')) {
        const id = e.sender.user_id
        const name = e.sender.nickname
        const command = e.raw_message.split(' ')
        const frequency = parseInt(command[1])
        let reply = ''

        if (command.length === 3) {
            if (command[2] === 'hd') {
                reply = onRoll(frequency, '100', true)
            } else {
                reply = onRoll(frequency, '100', false)
            }
        } else {
            const numbers = command[3]

            if (command[2] === 'hd') {
                reply = onRoll(frequency, numbers, true)
            } else {
                reply = onRoll(frequency, numbers, false)
            }
        }

        if (command[2] === 'hd') {
            this.sendPrivateMsg(id, reply)
        } else {
            e.reply(
                [
                    segment.at(id, name, false),
                    reply
                ]
            )
        }
    }

    if (e.raw_message.startsWith('.rd') || e.raw_message.startsWith("。rd")) {
        const name = e.sender.nickname
        const id = e.sender.user_id

        let reply = ''

        if (e.raw_message === '.rd' || e.raw_message === '。rd') {
            reply = onRd('100', false)
        }
        else {
            const numbers = e.raw_message.substring(4)
            reply = onRd(numbers, false)
        }

        e.reply(
            [
                segment.at(id, name, false),
                reply
            ]
        )
    }

    if (e.raw_message.startsWith('.rhd') || e.raw_message.startsWith("。rhd")) {
        const id = e.sender.user_id

        let reply = ''

        if (e.raw_message === '.rhd' || e.raw_message === '。rhd') {
            reply = onRd('100', true)
        }
        else {
            const numbers = e.raw_message.substring(4)
            reply = onRd(numbers, true)
        }

        this.sendPrivateMsg(id, reply)
    }

    if (e.raw_message.startsWith('。ra') || e.raw_message.startsWith('.ra')) {
        const name = e.sender.nickname
        const command = e.raw_message
        const reply = onRa(name, command)

        e.reply(
            [
                reply
            ]
        )
    }

    if (e.raw_message.startsWith(".name ") || e.raw_message.startsWith("。name ")) {
        const tags = e.raw_message.substring(6)
        const reply = onName(tags)

        e.reply(
            [
                reply
            ]
        )
    }
})

function onJrrp(name, jsonObj) {
    let reply = ''

    if (!(name in jsonObj)) {
        const num = getRandomIntInclusive(1, 100)
        jsonObj[name] = num + ''

        if (num < 10) {
            reply = ` 刀客塔今天的运气值为：${num}！刀客塔，我们的脚下，是一条漫长的道路。。。也许这是一次没有终点的旅行，但如果是和您一起，我觉得，非常幸福！`
        } else if (num < 60) {
            reply = ` 刀客塔今天的运气值为：${num}！无论多么艰难的任务，只要有刀客塔在，就一定能完成，我一直这样坚信着！`
        } else {
            reply = ` 刀客塔今天的运气值为：${num}！新的一天要加油哦～`
        }
    } else {
        reply = `别试啦，今天的运气值为${jsonObj[name]}！刀客塔，您还有许多事情需要处理，现在还不能休息哦。`
    }

    return reply
}

function onTarots(num, position) {
    let words = ''

    if (num != 13 && num != 15 && num != 16 && num != 18) {
        if (position === 0) {
            words = ' 恭喜你呢，刀客塔！你抽到了正位。希望能给你带来好运！'
        } else {
            words = ' 很遗憾，刀客塔你抽到了逆位呢。不过我会帮刀客塔再抽一次的！下一次一定是正位！'
        }
    } else if (num === 13 || num === 15 || num === 18) {
        if (position === 1) {
            words = ' 恭喜你呢，刀客塔！你抽到了逆位。希望能给你带来好运！'
        } else {
            words = ' 很遗憾，刀客塔你抽到了正位呢。普遍来说正位代表好运，可惜这张牌是个例外。'
        }
    } else {
        words = ' 塔！刀客塔你竟然抽到了如此罕见的牌。从某种意义上来说刀客塔你的运气也很好呢，哼哼～'
    }

    return words
}

function onRoll(frequency, numbers, hide) {
    if (parseInt(numbers.replace(/[^0-9]/ig, '')) === 0) {
        reply = '刀客塔，随机数上限必须大于0哦！'
        return reply
    }

    let reply = hide ? `刀客塔，你要的检定结果来了哦！让我看看，结果为：` : `刀客塔，从罗德岛传回来的结果为`

    for (let i = 0; i < frequency; i++) {
        let flexNum = 0
        let measureNum = parseInt(numbers.replace(/[^0-9]/ig, ''))
        let randomNum = getRandomIntInclusive(1, measureNum)
        let replyWords = `D${measureNum}=${randomNum}`

        if (measureNum === NaN) {
            replyWords = hide ? `D100=${getRandomIntInclusive(1, 100)}` : `D100=${getRandomIntInclusive(1, 100)}`
        }

        if (numbers.indexOf('+') != -1) {
            flexNum = numbers.split('+')[1]
            measureNum = parseInt(numbers.split("+")[0].replace(/[^0-9]/ig, ''))
            randomNum = getRandomIntInclusive(1, measureNum)
            let allNum = parseInt(flexNum) + randomNum
            replyWords = hide ? `D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}` : `D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}`
        }

        if (numbers.indexOf('-') != -1) {
            flexNum = numbers.split('-')[1]
            measureNum = parseInt(numbers.split('-')[0].replace(/[^0-9]/ig, ''))
            randomNum = getRandomIntInclusive(1, measureNum)
            let allNum = randomNum - parseInt(flexNum)
            replyWords = hide ? `D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}` : `D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}`
        }

        reply += `(${replyWords})`
    }

    return reply
}

function onRd(numbers, hide) {
    let flexNum = 0
    let measureNum = parseInt(numbers.replace(/[^0-9]/ig, ''))
    let randomNum = getRandomIntInclusive(1, measureNum)
    let reply = hide ? `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}=${randomNum}` : `刀客塔，从罗德岛传回来的结果为D${measureNum}=${randomNum}`

    if (measureNum === NaN) {
        reply = hide ? `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}=${randomNum}` : "刀客塔，从罗德岛传回来的结果为D100=" + getRandomIntInclusive(1, 100)
    }

    if (measureNum === 0) {
        reply = '刀客塔，随机数上限必须大于0哦！'
    }

    if (numbers.indexOf('+') != -1) {
        flexNum = numbers.split('+')[1]
        measureNum = parseInt(numbers.split("+")[0].replace(/[^0-9]/ig, ''))
        randomNum = getRandomIntInclusive(1, measureNum)
        let allNum = parseInt(flexNum) + randomNum
        reply = hide ? `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}` : `刀客塔，从罗德岛传回来的结果为D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}`
    }

    if (numbers.indexOf('-') != -1) {
        flexNum = numbers.split('-')[1]
        measureNum = parseInt(numbers.split('-')[0].replace(/[^0-9]/ig, ''))
        randomNum = getRandomIntInclusive(1, measureNum)
        let allNum = randomNum - parseInt(flexNum)
        reply = hide ? `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}` : `刀客塔，从罗德岛传回来的结果为D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}`
    }

    return reply
}

function onRa(name, command) {
    const numbers = command.substring(4)
    const skill = command.substring(3).replace(/[0-9]|\+|\-/ig, '')
    const randomNum = getRandomIntInclusive(1, 100)
    let flexNum = 0
    let measureNum = parseInt(numbers.replace(/[^0-9]/ig, ''))
    let bigFailureNum = 96
    let replyWords = '成功'
    let reply = ''

    if (numbers.indexOf('+') != -1) {
        flexNum = numbers.split('+')[1]
        measureNum = parseInt(numbers.split('+')[0].replace(/[^0-9]/ig, ''))
        measureNum += parseInt(flexNum)
    }

    if (numbers.indexOf('-') != -1) {
        flexNum = numbers.split('-')[1]
        measureNum = parseInt(numbers.split("-")[0].replace(/[^0-9]/ig, ''))
        measureNum -= parseInt(flexNum)
    }

    if ((measureNum - flexNum) >= 60)
        bigFailureNum = 100

    if (measureNum < randomNum) {
        replyWords = '失败'
        if (randomNum >= bigFailureNum)
            replyWords = '大失败'
    } else {
        if (randomNum <= measureNum / 2)
            replyWords = '困难成功'
        if (randomNum <= measureNum / 5)
            replyWords = '极难成功'
        if (randomNum === 1)
            replyWords = '大成功'
    }

    reply = `${name}进行的数值鉴定结果:1d100=${randomNum}/${measureNum} ${skill}${replyWords}`

    if (Number.isNaN(measureNum))
        reply = '刀客塔，我听不懂你在说什么，是我不能理解的命令呢?'

    return reply
}

function onName(tags) {
    const num = parseInt(tags.replace(/[^0-9|^\.|^\-]/ig, ''))
    let reply = ``
    let names = {}

    if (num <= 0) {
        reply = '刀客塔，.name后面跟着的数字一定要大于0哦'
        return reply
    }

    if (tags.search('cn') != -1) {
        names = getCnName(num)
    } else {
        names = getEnName(num)
    }

    reply = `刀客塔，你要的${num}个名字来了，分别为：\n`
    for (let i = 0; i < num; i++) {
        reply += `\n${i + 1}.`
        reply += names[i]
    }

    return reply
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

function getEnName(times) {
    let names = {}
    for (let i = 0; i < times; i++) {
        names[i] = random.name()
    }
    return names
}

function getCnName(times) {
    let names = {}
    for (let i = 0; i < times; i++) {
        names[i] = random.cname()
    }
    return names
}