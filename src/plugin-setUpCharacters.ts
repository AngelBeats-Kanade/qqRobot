import { segment } from 'oicq';
import { bot } from './index';

let players: IPlayers = {
    "Template": [
        {
            "name": "Role",
            "hp": "9",
            "san": "11",
            "magic": "11",
            "mov": "10",
            "力量": "50",
            "体质": "55",
            "体型": "65",
            "敏捷": "45",
            "外貌": "70",
            "智力": "75",
            "意志": "35",
            "教育": "65",
            "幸运": "75"
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
        let tags = e.raw_message.substr(4);
        let name = e.sender.nickname;
        let reply = ``;
        let roleAttribute = tags.replace(/[0-9]/ig, '');
        let attributeNum = tags.replace(/[^0-9]/ig, '');

        console.log(roleAttribute);

        if (name in players) {
            if (tags.search("del") != -1) {
                roleAttribute = roleAttribute.substr(3).replace(" ", "");
                players[name][0][roleAttribute] = '0';
                reply = `删除${roleAttribute}成功！`;
            }
            else if (tags.search("clr") != -1) {
                delete (players[name]);
                reply = `清除卡成功！`;
            }
            else if (tags.search("show") != -1) {
                if (tags.split("show")[1] != "") {
                    roleAttribute = roleAttribute.substr(4).replace(" ", "");
                    reply = `${roleAttribute}=${players[name][0][roleAttribute]}`;
                } else {
                    reply = `${players[name][0].hp}\n${players[name][0].magic}\n${players[name][0].mov}\n`;
                }
            } else {
                let roleAttributes = tags.split(" ");
                for (let i = 0; roleAttributes[i].split[":"][0] in players[name][0]; i++) {
                    players[name][0][roleAttributes[i].split[":"][0]] = roleAttributes[i].split[":"][1]
                    reply = `设置成功！${roleAttributes[i].split[":"][0]}=${roleAttributes[i].split[":"][1]}`
                }
            }
        } else {
            players[name] = players.Template
            e.reply(
                [
                    "初始化卡片成功！"
                ]
            )

            if (tags.search("del") != -1) {
                roleAttribute = roleAttribute.substr(3).replace(" ", "")
                players[name][0][roleAttribute] = '0'
                reply = `删除${roleAttribute}成功！`
            }
            else if (tags.search("clr") != -1) {
                players[name] = players.Template
                reply = `清除卡成功！`
            }
            else if (tags.search("show") != -1) {
                if (tags.split("show")[1] != "") {
                    roleAttribute = roleAttribute.substr(4).replace(" ", "")
                    reply = `${roleAttribute}=${players[name][0][roleAttribute]}`
                } else {
                    reply = `${players[name][0]}`
                }
            } else {
                let roleAttributes = tags.split(" ")
                for (let i = 0; roleAttributes[i].split[":"][0] in players[name][0]; i++) {
                    players[name][0][roleAttributes[i].split[":"][0]] = roleAttributes[i].split[":"][1]
                    reply = `设置成功！${roleAttributes[i].split[":"][0]}=${roleAttributes[i].split[":"][1]}`
                }
            }
        }

        e.reply(
            [
                reply
            ]
        )
    }
})

interface ICharacter {
    [key: string]: string;
}

interface IPlayers {
    [key: string]: ICharacter[]
}