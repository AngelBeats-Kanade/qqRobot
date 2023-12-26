import { bot } from './plugin-bot.js';

bot.on('system.online', function () {
	// 你的账号已上线，你可以做任何事
	console.log(`来自plugin-online: 我是${bot.nickname}(${bot.uin})，我有${bot.fl.size}个好友，${bot.gl.size}个群`);
})
