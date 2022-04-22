import { createClient } from 'oicq';
const account = 2198526707;
const password = 'Xtjjim123@';
const bot = createClient(account);

bot.on('system.login.qrcode', function (e) {
    this.logger.mark('扫码后按Enter完成登录'); //通过扫码二维码登录
    process.stdin.once('data', () => {
        this.login();
    })
})
    .on('system.login.error', function (e) {
        if (e.code < 0)
            this.login();
    })
    .login(password);

export { bot };