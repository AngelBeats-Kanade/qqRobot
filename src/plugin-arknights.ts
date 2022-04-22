import { bot } from './plugin-bot';
import * as fs from 'fs';
import * as schedule from 'node-schedule';

let players: IPlayers;
const arknightsData = 'data/arknights.json';

initialize();
schedule.scheduleJob('refreshDataEveryDay', '0 0 0 * * *', function () {
    let key: (keyof IPlayers);

    for (key in players) {
        players[key].dailyPulls = 0;
    }

    const data = JSON.stringify(players, null, 2);

    fs.writeFile(arknightsData, data, (err) => {
        if (err) {
            throw err;
        }
        console.log('JSON data is saved.');
    });
});

bot.on('message', function (e) {
    let name = e.sender.nickname;

    if (e.raw_message.search('阿米娅垫刀') != -1) {
        let number = e.raw_message.replace(/[^0-9]/ig, '');

        if (!(name in players)) {
            players[name].name = name;
            players[name].sixStars = 0;
            players[name].fiveStars = 0;
            players[name].totalPulls = 0;
            players[name].prePulls = 0; //指抽出货之前的垫刀，我实在不知道怎么翻译
            players[name].dailyPulls = 0;
            players[name].probability = '2%';
            // players[name] = new Player(name);
        }

        players[name].prePulls += (number === '') ? 1 : parseInt(number);
        players[name].dailyPulls += (number === '') ? 1 : parseInt(number);
        players[name].totalPulls += (number === '') ? 1 : parseInt(number);
        players[name].probability = getProbability(players[name].prePulls);

        const data = JSON.stringify(players, null, 2);
        fs.writeFile(arknightsData, data, (err) => {
            if (err) {
                throw err;
            }
            console.log('JSON data is saved.');
        });

        let reply = `${name}当前的垫刀数为：${players[name].prePulls}\n当前6星概率为：${players[name].probability}\n今日已抽卡：${players[name].dailyPulls}\n累计共抽取了：${players[name].totalPulls}\n累计获得了${players[name].sixStars}个六星和${players[name].fiveStars}个五星`;
        e.reply(reply);
    }
    if (e.raw_message.search('阿米娅设置') != -1) {
        const command = e.raw_message.substring(6).split(' ');

        for (let i = 0; i < command.length; i++) {
            const attribute = command[i].split(':')[0];
            const num = command[i].split(':')[1];

            if (attribute === '6星') {
                players[name].sixStars = parseInt(num);
                players[name].prePulls = 0;
            } else if (attribute === '5星') {
                players[name].fiveStars = parseInt(num);
            } else if (attribute === '总抽数') {
                players[name].totalPulls = parseInt(num);
            } else if (attribute === '今日抽数') {
                players[name].dailyPulls = parseInt(num);
            } else if (attribute === '垫刀') {
                players[name].prePulls = parseInt(num);
            }
        }

        players[name].probability = getProbability(players[name].prePulls);

        const data = JSON.stringify(players, null, 2);
        fs.writeFile(arknightsData, data, (err) => {
            if (err) {
                throw err;
            }
            console.log('JSON data is saved.');
        });
    }
})

interface IPlayers {
    [key: string]: IPlayer;
}

interface IPlayer {
    name: string;
    sixStars: number;
    fiveStars: number;
    totalPulls: number;
    prePulls: number;
    dailyPulls: number;
    probability: string;
}

class Player {
    name: string;
    sixStars: number;
    fiveStars: number;
    totalPulls: number;
    prePulls: number;
    dailyPulls: number;
    probability: string;

    constructor(name: string) {
        this.name = name;
        this.sixStars = 0;
        this.fiveStars = 0;
        this.totalPulls = 0;
        this.prePulls = 0; //指抽出货之前的垫刀，我实在不知道怎么翻译
        this.dailyPulls = 0;
        this.probability = '2%';
    }
}

function getProbability(num: number): string {
    let probability = 2;
    if (num > 50) {
        probability += (num - 50) * 2;
    }

    return (probability + '%');
}

function initialize() {
    fs.access(arknightsData, fs.constants.F_OK, (err) => {
        if (err)
            fs.writeFile(arknightsData, '{}', (err) => {
                if (err) {
                    throw err;
                }
            });

        fs.readFile(arknightsData, 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }

            players = JSON.parse(data.toString());
        });
    });
}
