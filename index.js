"use strict"
const account = 2198526707

const bot = require("oicq").createClient(account)

bot.on("system.login.qrcode", function (e) {
	this.logger.mark("扫码后按Enter完成登录") //通过扫码二维码登录
	process.stdin.once("data", () => {
		this.login()
	})
})
	.on("system.login.error", function (e) {
		if (e.code < 0)
			this.login()
	})
	.login()

exports.bot = bot

const pixivAppApi = require("pixiv-app-api")

const pixiv = new pixivAppApi("2445743081@qq.com", "xtjjim123!", {
	camelcaseKeys: true,
})

exports.pixiv = pixiv

require("./plugin-hello") //hello world
require("./plugin-image") //发送图文和表情
require("./plugin-request") //加群和好友
require("./plugin-random") //骰娘的功能
require("./plugin-pixiv") //pixiv的功能
require("./plugin-online") //监听上线事件
