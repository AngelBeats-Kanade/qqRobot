import {segment} from 'oicq';
import {bot} from './plugin-bot';
import * as schedule from 'node-schedule';
import mock from 'mockjs';
import * as fs from 'fs';

const random = mock.Random;
let dataJson: IDataJson = {};

const tarots = JSON.parse(fs.readFileSync('resources/tarots.json').toString());

schedule.scheduleJob('cleanDataEveryDay', '0 0 0 * * *', function () {
    dataJson = {};
})

bot.on('message', function (e) {
    if (e.raw_message === '.jrrp' || e.raw_message === '。jrrp') {
        const id = e.sender.user_id;
        const name = e.sender.nickname;
        const reply = onJrrp(name, dataJson);

        e.reply(
            [
                segment.at(id, name, false),
                reply
            ]
        );
    }

    if (e.raw_message === ".draw 单张塔罗牌" || e.raw_message === "。draw 单张塔罗牌") {
        const name = e.sender.nickname;
        const id = e.sender.user_id;
        const num = getRandomIntInclusive(0, 21);
        const position = getRandomIntInclusive(0, 1);
        const words = onTarots(num, position);

        e.reply(
            [
                segment.at(id, name, false),
                words
            ]
        );

        e.reply(
            [
                '' + tarots[num.toString()][position]
            ]
        );
    }

    if (e.raw_message.match(/(.|。)r(\d+)(d|hd)(\d+?)/i) != null) {
        const id = e.sender.user_id;
        const name = e.sender.nickname;
        const frequency = parseInt(e.raw_message.match(/.r(\d+)(d|hd)\d+?/)![1]);
        const command = e.raw_message.match(/.r(\d+)(d|hd)\d+?/)![2];
        const numberRegx = /.r\d+(d|hd)(.+?)/i;
        const number = numberRegx.test(e.raw_message) ? e.raw_message.match(/.r\d+(d|hd)(.+)/)![2] : '100';
        let reply: string;

        if (command === 'd') {
            reply = onRollDice(frequency, number, false);
            e.reply(
                [
                    segment.at(id, name, false),
                    reply
                ]
            );
        } else {
            reply = onRollDice(frequency, number, true);
            this.sendPrivateMsg(id, reply);
        }
    }

    if (e.raw_message.startsWith('.rd') || e.raw_message.startsWith("。rd")) {
        const name = e.sender.nickname;
        const id = e.sender.user_id;

        let reply: string;

        if (e.raw_message === '.rd' || e.raw_message === '。rd') {
            reply = onRollDiceOnce('100', false);
        }
        else {
            const numbers = e.raw_message.substring(4);
            reply = onRollDiceOnce(numbers, false);
        }

        e.reply(
            [
                segment.at(id, name, false),
                reply
            ]
        );
    }

    if (e.raw_message.startsWith('.rhd') || e.raw_message.startsWith("。rhd")) {
        const id = e.sender.user_id;
        let reply: string;

        if (e.raw_message === '.rhd' || e.raw_message === '。rhd') {
            reply = onRollDiceOnce('100', true);
        }
        else {
            const numbers = e.raw_message.substring(4);
            reply = onRollDiceOnce(numbers, true);
        }

        this.sendPrivateMsg(id, reply);
    }

    if (e.raw_message.startsWith('。ra') || e.raw_message.startsWith('.ra')) {
        const name = e.sender.nickname;
        const command = e.raw_message;
        const reply = onRollAction(name, command);

        e.reply(
            [
                reply
            ]
        );
    }

    if (e.raw_message.startsWith(".name ") || e.raw_message.startsWith("。name ")) {
        const tags = e.raw_message.substring(6);
        const reply = onName(tags);

        e.reply(
            [
                reply
            ]
        );
    }
})

function onJrrp(name: string, jsonObj: IDataJson): string {
    let reply: string;

    if (!(name in jsonObj)) {
        const num = getRandomIntInclusive(1, 100);
        jsonObj[name] = `${num}`;

        if (num < 10) {
            reply = ` 刀客塔今天的运气值为：${num}！刀客塔，我们的脚下，是一条漫长的道路。。。也许这是一次没有终点的旅行，但如果是和您一起，我觉得，非常幸福！`;
        } else if (num < 60) {
            reply = ` 刀客塔今天的运气值为：${num}！无论多么艰难的任务，只要有刀客塔在，就一定能完成，我一直这样坚信着！`;
        } else {
            reply = ` 刀客塔今天的运气值为：${num}！新的一天要加油哦～`;
        }
    } else {
        reply = `别试啦，今天的运气值为${jsonObj[name]}！刀客塔，您还有许多事情需要处理，现在还不能休息哦。`;
    }

    return reply;
}

function onTarots(num: number, position: number): string {
    let words: string;

    if (num != 13 && num != 15 && num != 16 && num != 18) {
        if (position === 0) {
            words = ' 恭喜你呢，刀客塔！你抽到了正位。希望能给你带来好运！';
        } else {
            words = ' 很遗憾，刀客塔你抽到了逆位呢。不过我会帮刀客塔再抽一次的！下一次一定是正位！';
        }
    } else if (num === 13 || num === 15 || num === 18) {
        if (position === 1) {
            words = ' 恭喜你呢，刀客塔！你抽到了逆位。希望能给你带来好运！';
        } else {
            words = ' 很遗憾，刀客塔你抽到了正位呢。普遍来说正位代表好运，可惜这张牌是个例外。';
        }
    } else {
        words = ' 塔！刀客塔你竟然抽到了如此罕见的牌。从某种意义上来说刀客塔你的运气也很好呢，哼哼～';
    }

    return words;
}

function onRollDice(frequency: number, number: string, hide: boolean): string {
    if (parseInt(number.replace(/[^0-9]/ig, '')) <= 0) {
        return '刀客塔，随机数上限必须大于0哦！';
    }

    let total = 0;
    let reply = hide ? `刀客塔，你要的检定结果来了哦！让我看看，结果为：` : `刀客塔，从罗德岛传回来的结果为`;

    for (let i = 0; i < frequency; i++) {
        let flexNum: number;
        let measureNum = parseInt(number.replace(/[^0-9]/ig, ''));
        let randomNum = getRandomIntInclusive(1, measureNum);
        let allNum = randomNum;
        let replyWords = `D${measureNum}=${randomNum}`;

        if (measureNum === NaN) {
            replyWords = hide ? `D100=${getRandomIntInclusive(1, 100)}` : `D100=${getRandomIntInclusive(1, 100)}`;
        }

        if (number.indexOf('+') != -1) {
            flexNum = parseInt(number.split('+')[1]);
            measureNum = parseInt(number.split("+")[0].replace(/[^0-9]/ig, ''));
            randomNum = getRandomIntInclusive(1, measureNum);
            allNum = flexNum + randomNum;
            replyWords = hide ?
                `D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}` :
                `D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}`;
        }

        if (number.indexOf('-') != -1) {
            flexNum = parseInt(number.split('-')[1]);
            measureNum = parseInt(number.split('-')[0].replace(/[^0-9]/ig, ''));
            randomNum = getRandomIntInclusive(1, measureNum);
            allNum = randomNum - flexNum;
            replyWords = hide ?
                `D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}` :
                `D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}`;
        }

        total += allNum;
        reply += `(${replyWords})+`;
    }

    return `${reply.slice(0, -1)} = ${total}`;
}

function onRollDiceOnce(number: string, hide: boolean): string {
    let flexNum: number;
    let measureNum = parseInt(number.replace(/[^0-9]/ig, ''));
    let randomNum = getRandomIntInclusive(1, measureNum);
    let reply = hide ?
        `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}=${randomNum}` :
        `刀客塔，从罗德岛传回来的结果为D${measureNum}=${randomNum}`;

    if (measureNum === NaN) {
        reply = hide ?
            `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}=${randomNum}` :
            "刀客塔，从罗德岛传回来的结果为D100=" + getRandomIntInclusive(1, 100);
    }

    if (measureNum <= 0) {
        reply = '刀客塔，随机数上限必须大于0哦！';
    }

    if (number.indexOf('+') != -1) {
        flexNum = parseInt(number.split('+')[1]);
        measureNum = parseInt(number.split("+")[0].replace(/[^0-9]/ig, ''));
        randomNum = getRandomIntInclusive(1, measureNum);
        let allNum = flexNum + randomNum;
        reply = hide ?
            `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}` :
            `刀客塔，从罗德岛传回来的结果为D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}`;
    }

    if (number.indexOf('-') != -1) {
        flexNum = parseInt(number.split('-')[1]);
        measureNum = parseInt(number.split('-')[0].replace(/[^0-9]/ig, ''));
        randomNum = getRandomIntInclusive(1, measureNum);
        let allNum = randomNum - flexNum;
        reply = hide ?
            `刀客塔，你要的检定结果来了哦！让我看看，结果为：D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}` :
            `刀客塔，从罗德岛传回来的结果为D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}`;
    }

    return reply
}

function onRollAction(name: string, command: string): string {
    const numbers = command.substring(4);
    const skill = command.substring(3).replace(/[0-9]|\+|\-/ig, '');
    const randomNum = getRandomIntInclusive(1, 100);
    let flexNum: number = 0;
    let measureNum = parseInt(numbers.replace(/[^0-9]/ig, ''));
    let bigFailureNum = 96;
    let replyWords = '成功';
    let reply: string;

    if (numbers.indexOf('+') != -1) {
        flexNum = parseInt(numbers.split('+')[1]);
        measureNum = parseInt(numbers.split('+')[0].replace(/[^0-9]/ig, ''));
        measureNum += flexNum;
    }

    if (numbers.indexOf('-') != -1) {
        flexNum = parseInt(numbers.split('-')[1]);
        measureNum = parseInt(numbers.split("-")[0].replace(/[^0-9]/ig, ''));
        measureNum -= flexNum;
    }

    if ((measureNum - flexNum) >= 60)
        bigFailureNum = 100;

    if (measureNum < randomNum) {
        replyWords = '失败';
        if (randomNum >= bigFailureNum)
            replyWords = '大失败';
    } else {
        if (randomNum <= measureNum / 2)
            replyWords = '困难成功';
        if (randomNum <= measureNum / 5)
            replyWords = '极难成功';
        if (randomNum === 1)
            replyWords = '大成功';
    }

    reply = `${name}进行的数值鉴定结果:1d100=${randomNum}/${measureNum} ${skill}${replyWords}`;

    if (Number.isNaN(measureNum))
        reply = '刀客塔，我听不懂你在说什么，是我不能理解的命令呢?'

    return reply;
}

function onName(tags: string): string {
    const num = parseInt(tags.replace(/[^0-9|^\.|^\-]/ig, ''));
    let reply: string;
    let names: INames = {};

    if (num <= 0) {
        reply = '刀客塔，.name后面跟着的数字一定要大于0哦';
        return reply;
    }

    if (tags.search('cn') != -1) {
        names = getCnName(num);
    } else {
        names = getEnName(num);
    }

    reply = `刀客塔，你要的${num}个名字来了，分别为：\n`;
    for (let i = 0; i < num; i++) {
        reply += `\n${i + 1}.`;
        reply += names[i];
    }

    return reply;
}

function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

function getEnName(times: number): INames {
    let names: INames = {};
    for (let i = 0; i < times; i++) {
        names[i] = random.name();
    }
    return names;
}

function getCnName(times: number): INames {
    let names: INames = {};
    for (let i = 0; i < times; i++) {
        names[i] = random.cname();
    }
    return names;
}

interface IDataJson {
    [key: string]: string;
}

interface INames {
    [key: number]: string;
}