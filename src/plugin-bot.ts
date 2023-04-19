import { createClient } from 'oicq';
import readlineSync from 'readline-sync';

const account = readlineSync.question('May I have your account?\nAccount: ');
const password = readlineSync.question('What is your password?\nPassword: ', {
    hideEchoBack: true
});

const bot = createClient(parseInt(account));

bot.on('system.login.slider', function () {
    console.log('输入ticket：')
    process.stdin.once('data', ticket => this.submitSlider(String(ticket).trim()))
}).login(password);

export { bot };