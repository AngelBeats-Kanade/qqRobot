import { segment } from 'oicq';
import { bot } from './plugin-bot';

let players: IPlayers = {
    "Template": [
        {
            "name": "Role",
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
        }
    ]
};

bot.on('message', function (e) {
    if (e.raw_message === '.st' || e.raw_message === '。st') {
        let reply = `属性记录：.st (del/clr/show) ([属性名]:[属性值])\n.st 力量:50 体质:55 体型:65 敏捷:45 外貌:70 智力:75 意志:35 教育:65 幸运:75\n.st hp-1 后接+/-时视为从原值上变化\n.st san+1d6 修改属性时可使用掷骰表达式\n.st del kp裁决 //删除已保存的属性\n.st clr //清空当前卡\n.st show 灵感 //查看指定属性\n.st show //无参数时查看所有属性，请使用只st加点过技能的半自动人物卡！\n部分COC属性会被视为同义词，如智力/灵感、理智/san、侦查/侦察`;
        e.reply(
            [
                reply
            ]
        );
    }

    if (e.raw_message.startsWith('.st ') || e.raw_message.startsWith('。st ')) {
        let tags = e.raw_message.substring(4);
        let name = e.sender.nickname;
        let reply: string;

        if (name in players) {
            let character = players[name][0];
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
                    reply = `${character.hp}\n${character.magic}\n${character.mov}\n`;
                }
            } else {
                let roleAttributes = tags.replace(/[(\w+):]/ig, '').split(' ');
                let attributeNums = tags.replace(/[:(\d+)]/ig, '').split(' ');
                reply = setUpSkills(character, roleAttributes, attributeNums);
            }
        } else {
            reply = '未查询到卡片，正在初始化卡片...\n初始化卡片成功！';
            players[name] = players.Template;
        }

        e.reply(
            [
                reply
            ]
        );
    }
})

function setUpSkills(character: ICharacter, skills: string[], numbers: string[]): string {
    let skillLength = skills.length;
    let numberLength = numbers.length;
    if (skillLength === numberLength) {
        let reply = '设置参数成功:';

        for (let i = 0; i < skillLength; i++) {
            setUpSkill(character, skills[i], parseInt(numbers[i]));
            reply += `\n${skills[i]}:${numbers[i]}`;
        }
    }

    return '抱歉博士，参数似乎并不匹配。请重新输入要分配的参数。';
}

function setUpSkill(character: ICharacter, skill: string, num: number) {
    if (isValidKey(skill, character)) {
        if (skill != 'name')
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

interface ICharacter {
    name: string;
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