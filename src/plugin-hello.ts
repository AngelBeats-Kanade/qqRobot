import { bot } from './plugin-bot';

// 向你的机器人发送 hello
bot.on('message', function (e) {
	if (e.raw_message.startsWith('hello') || e.raw_message.startsWith('你好'))
		e.reply('你好，刀客塔！');
})
