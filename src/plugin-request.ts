import { segment } from 'icqq';
import { bot } from './plugin-bot.js';

// 收到好友申请
bot.on('request.friend.add', async function (e) {
	// 同意
	await bot.setFriendAddRequest(e.flag);
	await bot.sendPrivateMsg(e.user_id, '我们已经是好友啦，一起来聊天吧！');
	// 拒绝
	// this.setFriendAddRequest(e.flag, false);
});

// 收到群邀请
bot.on('request.group.invite', async function (e) {
	// 同意
	await bot.setGroupAddRequest(e.flag);
	await bot.sendGroupMsg(e.group_id, '大家好，我是' + bot.nickname);
	// 拒绝
	// this.setGroupAddRequest(e.flag, false);
});

// 收到加群申请
bot.on('request.group.add', async function (e) {
	// 同意
	await bot.setGroupAddRequest(e.flag);
	await bot.sendGroupMsg(e.group_id, [
		'欢迎 ',
		segment.at(e.user_id),
		' 入群'
	]);
	// 拒绝
	// this.setGroupAddRequest(e.flag, false);
});
