import { segment } from 'oicq';
import { bot } from './plugin-bot';
import * as fs from 'fs';
import * as time from 'console';

let players: IPlayers;
const arknightsData = 'data/arknights.json';

initialize();

bot.on('message', function (e) {
    if (e.raw_message.search('阿米娅垫刀') != -1) {
        let number = e.raw_message.replace(/[^0-9]/ig, '');
        let name = e.sender.nickname;

        if (!(name in players)) {
            players[name].name = name;
            players[name].sixStars = 0
            players[name].fiveStars = 0
            players[name].totalPulls = 0
            players[name].prePulls = 0 //指抽出货之前的垫刀，我实在不知道怎么翻译
            players[name].dailyPulls = 0
            players[name].probability = '2%'
        }

        players[name].prePulls += (number === '') ? 1 : parseInt(number);
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
    if (e.raw_message.search('阿米娅设置') != -1) { }
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