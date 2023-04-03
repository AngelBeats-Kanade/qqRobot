import * as fs from 'fs';
import { bot } from './plugin-bot.js';

let players: IPlayers = {};

const playersData = 'data/playersData.json'

initialize();

bot.on('message', function (e) {
    if (e.raw_message === '.st' || e.raw_message === '。st') {
        const reply = `属性记录：.st (del/clr/show) ([属性名]:[属性值])\n.st hp:9 san:11 magic:11 mov:10 力量:50 体质:55 体型:65 敏捷:45 外貌:70 智力:75 意志:35 教育:65 幸运:75\n.st del hp //删除已保存的属性\n.st clr //清空当前卡\n.st show 灵感 //查看指定属性\n.st show //无参数时查看所有属性，请使用只st加点过技能的半自动人物卡！`;
        e.reply(
            [
                reply
            ]
        );
    }

    if (e.raw_message.startsWith('.st ') || e.raw_message.startsWith('。st ')) {
        const tags = e.raw_message.substring(4);
        const name = e.sender.nickname;
        let reply: string;

        if (name in players) {
            const character = players[name][0];
            let roleAttribute = tags.replace(/[0-9]/ig, '');

            if (tags.search('del') != -1) {
                roleAttribute = roleAttribute.substring(3).replace(' ', '');
                setUpSkill(character, roleAttribute, 0);
                reply = `删除${roleAttribute}成功！`;
            }
            else if (tags.search('clr') != -1) {
                delete (players[name]);
                reply = `清除卡成功！`;
            }
            else if (tags.search('show') != -1) {
                if (tags.split('show')[1] != '') {
                    roleAttribute = roleAttribute.substring(4).replace(' ', '');
                    reply = `${roleAttribute}=${getSkill(character, roleAttribute)}`;
                } else {
                    reply = `hp:${character.hp}\nsan:${character.san}\nmagic:${character.magic}\nmov:${character.mov}\n力量:${character.力量}\n体质:${character.体质}\n体型:${character.体型}\n敏捷:${character.敏捷}\n外貌:${character.外貌}\n智力:${character.智力}\n意志:${character.意志}\n教育:${character.教育}\n幸运:${character.幸运}`;
                }
            } else {
                const data = tags.split(' ');
                let roleAttributes: string[] = [];
                let attributeNums: string[] = [];

                for (let i = 0; i < data.length; i++) {
                    const skill = data[i].split(':')[0];
                    const num = data[i].split(':')[1];

                    roleAttributes.push(skill);
                    attributeNums.push(num);
                }

                reply = setUpSkills(character, roleAttributes, attributeNums);
            }
        } else {
            const template: ICharacter = {
                "hp": 9,
                "san": 11,
                "magic": 11,
                "mov": 10,
                "力量": 50,
                "体质": 55,
                "体型": 65,
                "敏捷": 45,
                "外貌": 70,
                "智力": 75,
                "意志": 35,
                "教育": 65,
                "幸运": 75,
            };

            players[name] = [template];
            reply = '未查询到卡片，正在初始化卡片...\n初始化卡片成功！';
        }

        const data = JSON.stringify(players, null, 2);

        fs.writeFile(playersData, data, (err) => {
            if (err) {
                throw err;
            }
            console.log('JSON data is saved.');
        });

        e.reply(
            [
                reply
            ]
        );
    }
})

function setUpSkills(character: ICharacter, skills: string[], numbers: string[]): string {
    const skillLength = skills.length;
    const numberLength = numbers.length;
    if (skillLength === numberLength) {
        let reply = '设置参数成功:';

        for (let i = 0; i < skillLength; i++) {
            setUpSkill(character, skills[i], parseInt(numbers[i]));
            reply += `\n${skills[i]}:${numbers[i]}`;
        }

        return reply;
    }

    return '抱歉博士，参数似乎并不匹配。请重新输入要分配的参数。';
}

function setUpSkill(character: ICharacter, skill: string, num: number) {
    if (isValidKey(skill, character)) {
        character[skill] = num;
    }
}

function getSkill(character: ICharacter, skill: string): number | string {
    if (isValidKey(skill, character)) {
        return character[skill];
    } else {
        return '没有这项属性';
    }
}

function isValidKey(key: string, object: ICharacter): key is keyof typeof object {
    return key in object;
}

function initialize() {
    fs.access(playersData, fs.constants.F_OK, (err) => {
        if (err)
            fs.writeFile(playersData, '{}', (err) => {
                if (err) {
                    throw err;
                }
            });

        fs.readFile(playersData, 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }

            players = JSON.parse(data.toString());
        });
    });
}

interface ICharacter {
    hp: number;
    san: number;
    magic: number;
    mov: number;
    力量: number;
    体质: number;
    体型: number;
    敏捷: number;
    外貌: number;
    智力: number;
    意志: number;
    教育: number;
    幸运: number;
}

interface IPlayers {
    [key: string]: ICharacter[]
}