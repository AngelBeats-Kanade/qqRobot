"use strict"
const { segment } = require("oicq")
const { bot } = require("./index")
const mock = require("mockjs")
const random = mock.Random

var jsonObj = {}

var tarots = {
    "0": [
        "【0】愚者正位：憧憬自然的地方、毫无目的地前行、喜欢尝试挑战新鲜事物、四处流浪。明知是毫无意义的冒险，错误的选择及失败的结果，却一意孤行，盲目地追求梦想而完全忽略现实；好冒险、寻梦人、不拘泥于传统的观念、自由奔放、一切从基础出发、四处流浪。自由恋爱、不顾及他人看法、以独特的方式获得成功、轻易坠入爱河、浪漫多彩的爱情、独特的恋人、等待交往机会。工作上具冒险心、追求新奇。热衷于事业或学业、以独特的方式取得意外的收获、由于好奇心对当前的学业产生浓厚的兴趣、把握重点、寻求捷径、倾向于自由的工作氛围、适合艺术类工作或从事自由职业。健康状况佳。旅行有意外收获。美好的梦想。",
        "【0】愚者逆位：冒险的行动，追求可能性，重视梦想，无视物质的损失，离开家园，过于信赖别人，为出外旅行而烦恼。心情空虚、轻率的恋情、无法长久持续的融洽感、不安的爱情的旅程、对婚姻感到束缚、彼此忽冷忽热、不顾众人反对坠入爱河、为恋人的负心所伤、感情不专一。工作缺乏稳定性、无责任。成绩一落千丈、没有耐心、行事缺乏计划、经常迟到、猜题错误导致考试失利、考前突击无法为你带来太大的效果。因不安定的生活而生病。不能放心的旅行。不能下决心、怪癖。不切实际。"
    ],
    "1": [
        "【I】魔术师正位：事情的开始，行动的改变，熟练的技术及技巧，贯彻我的意志，运用自然的力量来达到野心。",
        "【I】魔术师逆位：意志力薄弱，起头难，走入错误的方向，知识不足，被骗和失败。"
    ],
    "2": [
        "【II】女祭司正位：开发出内在的神秘潜力，前途将有所变化的预言，深刻地思考，敏锐的洞察力，准确的直觉。",
        "【II】女祭司逆位：过于洁癖，无知，贪心，目光短浅，自尊心过高，偏差的判断，有勇无谋，自命不凡。"
    ],
    "3": [
        "【III】女皇正位：幸福，成功，收获，无忧无虑，圆满的家庭生活，良好的环境，美貌，艺术，与大自然接触，愉快的旅行，休闲。",
        "【III】女皇逆位：不活泼，缺乏上进心，散漫的生活习惯，无法解决的事情，不能看到成果，担于享乐，环境险恶，与家人发生纠纷。"
    ],
    "4": [
        "【IV】皇帝正位：光荣，权力，胜利，握有领导权，坚强的意志，达成目标，父亲的责任，精神上的孤单。",
        "【IV】皇帝逆位：幼稚，无力，独裁，撒娇任性，平凡，没有自信，行动力不足，意志薄弱，被支配。"
    ],
    "5": [
        "【V】教皇正位：援助，同情，宽宏大量，可信任的人给予的劝告，良好的商量对象，得到精神上的满足，遵守规则，志愿者。信心十足，能正确理解事物本质，工作上外来压力过多，使你有被束缚的感觉。寻找新的工作方法，尽管会面对很大的阻力，但结果会证明这样做是值得的。爱情上屈从于他人的压力，只会按照对方的要求来盲目改变自己，自以为这是必要的付出，其实不过是被迫的选择。伴侣也不会对你保持忠诚，并很难满足双方真实的需要。",
        "【V】教皇逆位：错误的讯息，恶意的规劝，上当，援助被中断，愿望无法达成，被人利用，被放弃。事业上多了些灵活的态度，不再刻板遵循旧有的方式，勇于创新形成自己独特的理念，为自己的真实想法而活、而工作。感情上开始正视自己对感情的真实感受与做法，尽管依旧会听取对方的意见，但以不会全盘接受。当你感到无法接受对方的意见时，会及时与其沟通，找出改善关系的做法。"
    ],
    "6": [
        "【VI】恋人正位：撮合，爱情，流行，兴趣，充满希望的未来，魅力，增加朋友。感情和肉体对爱的渴望，它暗示恋情将向彼此关系更亲密的方向发展。事业上将面临重大的抉择，它将关系到你的未来前途。",
        "【VI】恋人逆位：禁不起诱惑，纵欲过度，反覆无常，友情变淡，厌倦，争吵，华丽的打扮，优柔寡断。感情上表现幼稚，对成长虽有期待与希望，却希望永远躲避危险，逃避责任。事业上总保持着很高的戒心，让人感到很不舒服，不愿同你合作。"
    ],
    "7": [
        "【VII】战车正位：努力而获得成功，胜利，克服障碍，行动力，自立，尝试，自我主张，年轻男子，交通工具，旅行运大吉。事业上显示出才能，办事卓有成效。",
        "【VII】战车逆位：争论失败，发生纠纷，阻滞，违返规则，诉诸暴力，顽固的男子，突然的失败，不良少年，挫折和自私自利。"
    ],
    "8": [
        "【VIII】力量正位：大胆的行动，有勇气的决断，新发展，大转机，异动，以意志力战胜困难，健壮的女人。",
        "【VIII】力量逆位：胆小，输给强者，经不起诱惑，屈服在权威与常识之下，没有实践便告放弃，虚荣，懦弱，没有耐性。内心的恐惧使你畏首畏尾，进而遭遇事业的瓶颈，感到失去了自信。在爱情上患得患失，失去清醒的判断。"
    ],
    "9": [
        "【IX】隐者正位：隐藏的事实，个别的行动，倾听他人的意见，享受孤独，自己的丢化，有益的警戒，年长者，避开危险，祖父，乡间生活。你在事业黄金时期引退，旁人都不了解这不过是你在为下一次黄金时期的到来进行休息。感情方面你将深刻思考自己在这段感情中的角色和地位，并探索彼此之间的关系。",
        "【IX】隐者逆位：无视警，憎恨孤独，自卑，担心，幼稚思想，过于慎重导致失败，偏差，不宜旅行。在事业中过多的投入已经让你不愿面对其它事情，因而事业有了突破性的进展。在感情方面，用工作繁忙来逃避这段感情的发展，对伴侣态度冷淡，因为害怕感情的发展而在关键时刻退缩，使对方心寒。"
    ],
    "10": [
        "【X】命运之轮正位：关键性的事件，有新的机会，因的潮流，环境的变化，幸运的开端，状况好转，问题解决，幸运之神降临。命运之轮正转到了你人生最低迷的时刻，也许你有些无法接受，但是若能以平常心来看待，这无疑是你成长的最好时机，需要认真面对。感情方面所受到的挫折近乎让你崩溃，然而你还在不断努力。虽然你面前是无数的荆棘，但坚持过去将是平坦的大道。你会发现以前所付出的无谓努力，而今反而成了你前进的动力，先前的付出终于有了回报。命运之轮是由命运女神转动的，所以你俩之前的风风雨雨都将过去，关系将进入稳定的发展阶段。",
        "【X】命运之轮逆位：边疆的不行，挫折，计划泡汤，障碍，无法修正方向，往坏处发展，恶性循环，中断。"
    ],
    "11": [
        "【XI】正义正位：公正、中立、诚实、心胸坦荡、表里如一、身兼二职、追求合理化、协调者、与法律有关、光明正大的交往、感情和睦。事业上你不会有其它太多的感觉，只是按照以前的计划认真地执行。你对感情生活相当满意，对于你的选择对方都是接受的态度。",
        "【XI】正义逆位：失衡、偏见、纷扰、诉讼、独断专行、问心有愧、无法两全、表里不一、男女性格不合、情感波折、无视社会道德的恋情。长时间的压抑使你在事业最关键的时刻倒下了，需要认真修整一番才能再次前进。"
    ],
    "12": [
        "【XII】倒吊者正位：接受考验、行动受限、牺牲、不畏艰辛、不受利诱、有失必有得、吸取经验教训、浴火重生、广泛学习、奉献的爱。",
        "【XII】倒吊者逆位：无谓的牺牲、骨折、厄运、不够努力、处于劣势、任性、利己主义者、缺乏耐心、受惩罚、逃避爱情、没有结果的恋情。当牌面倒立时，事业上缺乏远见，迷失了努力的目标。"
    ],
    "13": [
        "【XIII】死神正位：失败、接近毁灭、生病、失业、维持停滞状态、持续的损害、交易停止、枯燥的生活、别离、重新开始、双方有很深的鸿沟、恋情终止。",
        "【XIII】死神逆位：抱有一线希望、起死回生、回心转意、摆脱低迷状态、挽回名誉、身体康复、突然改变计划、逃避现实、斩断情丝、与旧情人相逢。"
    ],
    "14": [
        "【XIV】节制正位：单纯、调整、平顺、互惠互利、好感转为爱意、纯爱、深爱。",
        "【XIV】节制逆位：消耗、下降、疲劳、损失、不安、不融洽、爱情的配合度不佳。"
    ],
    "15": [
        "【XV】恶魔正位：被束缚、堕落、生病、恶意、屈服、欲望的俘虏、不可抗拒的诱惑、颓废的生活、举债度日、不可告人的秘密、私密恋情。",
        "【XV】恶魔逆位：逃离拘束、解除困扰、治愈病痛、告别过去、暂停、别离、拒绝诱惑、舍弃私欲、别离时刻、爱恨交加的恋情。"
    ],
    "16": [
        "【XVI】塔正位：破产、逆境、被开除、急病、致命的打击、巨大的变动、受牵连、信念崩溃、玩火自焚、纷扰不断、突然分离，破灭的爱。",
        "【XVI】塔逆位：困境、内讧、紧迫的状态、状况不佳、趋于稳定、骄傲自大将付出代价、背水一战、分离的预感、爱情危机。"
    ],
    "17": [
        "【XVII】星星正位：前途光明、充满希望、想象力、创造力、幻想、满足愿望、水准提高、理想的对象、美好的恋情。",
        "【XVII】星星逆位：挫折、失望、好高骛远、异想天开、仓皇失措、事与愿违、工作不顺心、情况悲观、秘密恋情、缺少爱的生活。"
    ],
    "18": [
        "【XVIII】月亮正位：不安、迷惑、动摇、谎言、欺骗、鬼迷心窍、动荡的爱、三角关系。",
        "【XVIII】月亮逆位：逃脱骗局、解除误会、状况好转、预知危险、等待、正视爱情的裂缝。"
    ],
    "19": [
        "【XIX】太阳正位：活跃、丰富的生命力、充满生机、精力充沛、工作顺利、贵人相助、幸福的婚姻、健康的交际。",
        "【XIX】太阳逆位：沉、体力不佳、缺乏连续性、意气消沉、生活不安、人际关系不好、感情波动、离婚。"
    ],
    "20": [
        "【XX】审判正位：复活的喜悦、康复、坦白、好消息、好运气、初露锋芒、复苏的爱、重逢、爱的奇迹。",
        "【XX】审判逆位：一蹶不振、幻灭、隐瞒、坏消息、无法决定、缺少目标、没有进展、消除、恋恋不舍。"
    ],
    "21": [
        "【XXI】世界正位：完成、成功、完美无缺、连续不断、精神亢奋、拥有毕生奋斗的目标、完成使命、幸运降临、快乐的结束、模范情侣。",
        "【XXI】世界逆位：未完成、失败、准备不足、盲目接受、一时不顺利、半途而废、精神颓废、饱和状态、合谋、态度不够融洽、感情受挫。"
    ]
}

setInterval(function () {
    var date = new Date()
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (h === 0 && m === 0 && s === 0)
        jsonObj = {}
}, 0)

bot.on("message", function (e) {
    if (e.raw_message === ".jrrp" || e.raw_message === "。jrrp") {
        var name = e.sender.nickname

        if (!(name in jsonObj)) {
            var num = getRandomIntInclusive(1, 100)
            jsonObj[name] = num + ""

            e.reply(
                [
                    segment.at(e.user_id, '@' + e.sender.nickname, false),
                    " 刀客塔今天的运气值为：" + num + "！新的一天要加油哦～"
                ]
            )
        } else {
            e.reply(
                [
                    segment.at(e.user_id, '@' + e.sender.nickname, false),
                    " 别试啦，今天的运气值为" + jsonObj[name] + "！刀客塔，还有很多工作没做，还不能休息哦。"
                ]
            )
        }
    }
})

bot.on("message", function (e) {
    if (e.raw_message === ".rd" || e.raw_message === "。rd")
        e.reply(
            [
                segment.at(e.user_id, '@' + e.sender.nickname, false),
                " 刀客塔，从罗德岛传回来的结果为D100=" + getRandomIntInclusive(1, 100)
            ]
        )

    if (e.raw_message.startsWith(".rd ") || e.raw_message.startsWith("。rd ")) {
        var numbers = e.raw_message.substr(4)
        var flexNum = 0
        var measureNum = parseInt(numbers.replace(/[^0-9]/ig, ""))
        var randomNum = getRandomIntInclusive(1, measureNum)
        var reply = `刀客塔，从罗德岛传回来的结果为D${measureNum}=${randomNum}`

        if (numbers.indexOf("+") != -1) {
            flexNum = numbers.split("+")[1]
            measureNum = parseInt(numbers.split("+")[0].replace(/[^0-9]/ig, ""))
            randomNum = getRandomIntInclusive(1, measureNum)
            var allNum = parseInt(flexNum) + randomNum
            reply = `刀客塔，从罗德岛传回来的结果为D${measureNum}+${flexNum}=${randomNum}+${flexNum}=${allNum}`
        }

        if (numbers.indexOf("-") != -1) {
            flexNum = numbers.split("-")[1]
            measureNum = parseInt(numbers.split("-")[0].replace(/[^0-9]/ig, ""))
            randomNum = getRandomIntInclusive(1, measureNum)
            var allNum = randomNum - parseInt(flexNum)
            reply = `刀客塔，从罗德岛传回来的结果为D${measureNum}-${flexNum}=${randomNum}-${flexNum}=${allNum}`
        }

        e.reply(
            [
                segment.at(e.user_id, '@' + e.sender.nickname, false),
                " " + reply
            ]
        )
    }
})

bot.on("message", function (e) {
    if (e.raw_message === ".draw 单张塔罗牌" || e.raw_message === "。draw 单张塔罗牌") {
        var num = getRandomIntInclusive(0, 21)
        var position = getRandomIntInclusive(0, 1)

        if (num != 13 && num != 15 && num != 16 && num != 18) {
            if (position == 0) {
                var words = " 恭喜你呢，刀客塔！你抽到了正位。希望能给你带来好运！"
            } else {
                var words = " 很遗憾，刀客塔你抽到了逆位呢。不过我会帮刀客塔再抽一次的！下一次一定是正位！"
            }
        } else if (num == 13 || num == 15 || num == 18) {
            if (position == 1) {
                var words = " 恭喜你呢，刀客塔！你抽到了逆位。希望能给你带来好运！"
            } else {
                var words = " 很遗憾，刀客塔你抽到了正位呢。普遍来说正位代表好运，可惜这张牌是个例外。"
            }
        } else {
            var words = " 塔！刀客塔你竟然抽到了如此罕见的牌。从某种意义上来说刀客塔你的运气也很好呢，哼哼～"
        }

        e.reply(
            [
                segment.at(e.user_id, '@' + e.sender.nickname, false),
                words
            ]
        )

        e.reply(
            [
                '' + tarots[num.toString()][position]
            ]
        )
    }
})


bot.on("message", function (e) {
    if (e.raw_message === "。rhd" || e.raw_message === ".rhd") {
        this.sendPrivateMsg(e.user_id, "刀客塔，你要的检定结果来了哦！让我看看，结果为：D100=" + getRandomIntInclusive(1, 100))
    }

    if (e.raw_message.startsWith("。rhd ") || e.raw_message.startsWith(".rhd ")) {
        var num = e.raw_message.replace(/[^0-9]/ig, "")
        this.sendPrivateMsg(e.user_id, "刀客塔，你要的检定结果来了哦！让我看看，结果为：D" + num + "=" + getRandomIntInclusive(1, num))
    }
})

bot.on("message", function (e) {
    if (e.raw_message.startsWith("。ra") || e.raw_message.startsWith(".ra")) {
        var reply = ""
        var numbers = e.raw_message.substr(4)
        var flexNum = 0
        var measureNum = parseInt(numbers.replace(/[^0-9]/ig, ""))
        var randomNum = getRandomIntInclusive(1, measureNum)
        var bigFailureNum = 96
        var skill = e.raw_message.substr(3).replace(/[0-9]|\+|\-/ig, "")
        var replyWords = "成功"

        if (numbers.indexOf("+") != -1) {
            flexNum = numbers.split("+")[1]
            measureNum = parseInt(numbers.split("+")[0].replace(/[^0-9]/ig, ""))
            measureNum += parseInt(flexNum)
            randomNum = getRandomIntInclusive(1, measureNum)
        }

        if (numbers.indexOf("-") != -1) {
            flexNum = numbers.split("-")[1]
            measureNum = parseInt(numbers.split("-")[0].replace(/[^0-9]/ig, ""))
            measureNum -= parseInt(flexNum)
            randomNum = getRandomIntInclusive(1, measureNum)
        }

        if ((measureNum - flexNum) >= 60)
            bigFailureNum = 100

        if (measureNum < randomNum) {
            replyWords = "失败"
            if (randomNum >= bigFailureNum)
                replyWords = "大失败"
        } else {
            if (randomNum <= measureNum / 2)
                replyWords = "困难成功"
            if (randomNum <= measureNum / 5)
                replyWords = "极难成功"
            if (randomNum == 1)
                replyWords = "大成功"
        }

        reply = e.sender.nickname + "进行的数值鉴定结果:1d100=" + randomNum + "/" + measureNum + " " + skill + replyWords

        if (Number.isNaN(measureNum))
            reply = "刀客塔，我听不懂你在说什么，是我不能理解的命令呢?"
        e.reply(
            [
                reply
            ]
        )
    }
})

bot.on("message", function (e) {
    if (e.raw_message.startsWith(".name ") || e.raw_message.startsWith("。name ")) {
        var tags = e.raw_message.substr(6)
        var num = parseInt(tags.replace(/[^0-9|^\.|^\-]/ig, ""))
        var reply = ``
        var names = {}
        if (num <= 0) {
            e.reply("刀客塔，.name后面跟着的数字一定要大于0哦")
            return -1
        }
        if (tags.search("cn") != -1) {
            names = getCnName(num)
        } else {
            names = getEnName(num)
        }
        reply = `刀客塔，你要的${num}个名字来了，分别为：\n`
        for (var i = 0; i < num; i++) {
            reply += `\n${i + 1}.`
            reply += names[i]
        }
        e.reply(
            [
                reply
            ]
        )
    }
})

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}

function getEnName(times) {
    var names = {}
    for (var i = 0; i < times; i++) {
        names[i] = random.name()
    }
    return names
}

function getCnName(times) {
    var names = {}
    for (var i = 0; i < times; i++) {
        names[i] = random.cname()
    }
    return names
}