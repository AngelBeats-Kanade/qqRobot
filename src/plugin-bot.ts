import { createClient } from 'oicq';
const account = 2198526707;
const password = 'Xtjjim123@';
const bot = createClient(account);

bot.on("system.login.slider", function () {
    console.log("输入ticket：")
    process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
}).login(password)

// bot.on('system.login.device', function () {
//     this.logger.mark('输入密保手机收到的短信验证码后按下回车键继续');
//     this.sendSmsCode();
//     process.stdin.once('data', (input) => {
//         this.submitSmsCode(input.toString());
//     })
// })
//     .on('system.login.slider', function () {
//         this.logger.mark('输入ticket:');
//         process.stdin.once('data', (ticket) => {
//             this.submitSlider(String(ticket).trim())
//         });
//     })
//     .on('system.login.qrcode', function () {
//         this.logger.mark('扫码后按Enter完成登录'); //通过扫码二维码登录
//         process.stdin.once('data', () => {
//             this.login();
//         })
//     })
//     .on('system.login.error', function (e) {
//         if (e.code < 0)
//             this.login();
//     })
//     .login(password);

export { bot };