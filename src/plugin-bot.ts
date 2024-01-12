import { createClient } from 'icqq';
import readlineSync from 'readline-sync';

const args = process.argv.slice(2);
const hasAccount = ((args.indexOf('account') !== -1) && (args[args.indexOf('account') + 1] !== undefined));
const hasPassword = ((args.indexOf('password') !== -1) && (args[args.indexOf('password') + 1] !== undefined));

const account = hasAccount ? args[args.indexOf('account') + 1] : readlineSync.question('May I have your account?\nAccount: ');
const password = hasPassword ? args[args.indexOf('password') + 1] : readlineSync.question('What is your password?\nPassword: ', {
    hideEchoBack: true
});

const bot = createClient({ ver: '8.9.78', sign_api_addr: `https://ray.pixiv-ab.site/qsign/sign?key=114514` });

bot.on('system.login.slider', (e) => {
    console.log('输入滑块地址获取的ticket后继续。\n滑块地址:    ' + e.url);
    const ticket = readlineSync.question('ticket: ');
    bot.submitSlider(ticket.toString().trim());

});
bot.on('system.login.qrcode', () => {
    const data = readlineSync.question('扫码完成后回车继续:    ');
    if (data.length != 0) { }
    bot.login();

});
bot.on('system.login.device', (e) => {
    const verify = readlineSync.question('请选择验证方式:(1：短信验证   其他：扫码验证)');

    if (verify.toString().trim() === '1') {
        bot.sendSmsCode();

        const sms_code = readlineSync.question('请输入手机收到的短信验证码:');

        bot.submitSmsCode(sms_code.toString().trim());
    } else {
        const data = readlineSync.question('扫码完成后回车继续：' + e.url);

        if (data !== null) {
            bot.login();
        }
    }
});
bot.login(parseInt(account), password);

export { bot };