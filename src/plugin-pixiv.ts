import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent, segment } from 'oicq';
import fetch from 'node-fetch';
import { bot } from './plugin-bot.js';

bot.on('message', async function (e) {
    if (e.raw_message === '来点二次元') {
        await onDailyPictureAsync(e, false);
    }

    if (e.raw_message === '来点色图') {
        await onDailyPictureAsync(e, true);
    }

    if (e.raw_message.startsWith('来点二次元 ')) {
        const tags = e.raw_message.substring(6);

        await onDailyPictureAsync(e, false, tags);
    }

    if (e.raw_message.startsWith('来点色图 ')) {
        const tags = e.raw_message.substring(5);

        await onDailyPictureAsync(e, true, tags);
    }

    if (e.raw_message === '阿米娅，告诉我怎么用tag搜索' || e.raw_message === '.help tag') {
        e.reply(`刀客塔，阿米娅的tag搜索有两种方式。第一种是直接输入tag（仅支持单独tag），实例：“来点二次元 明日方舟”；第二种是输入数字，数字代表的是该图片在p站日榜的排名，实例：“来点二次元 1”，即代表取p站日榜第一名的图片。非r18搜索支持1~500名，r18搜索支持1~100名。`);
    }
})

async function onDailyPictureAsync(e: PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent, r18: boolean, tag?: string) {
    let response: IPicture | number;
    if (tag) {
        const randomTags = tag.split(' ');
        response = await fetchPictureByTagAsync(randomTags, r18);
    } else {
        response = await fetchPictureByRandomAsync(r18);
    }
    if (typeof response != 'number') {
        const picture = response;
        const title = picture.title;
        const artist = picture.artist;
        const url = picture.url;
        const user_id = picture.uid;
        const tags = picture.tags;
        const picture_id = picture.id;
        const head = r18 ? '色图来了！嘿嘿嘿～' : '二次元图片来了！';
        const reply = `${head}\n作者：${artist}\nuid：${user_id}\ntitle：${title}\ntags：${tags}\np站链接：https://pixiv.net/artworks/${picture_id}`;
        const replyResult = await e.reply([reply, segment.image(url)]);

        if (r18) {
            setTimeout(() => { bot.deleteMsg(replyResult["message_id"]); }, 10000);
        }
    } else {
        switch (response) {
            case 404:
                await e.reply('刀客塔，换个tag冲吧！');
                break;

            case 500:
                await e.reply('刀客塔慢点冲，阿米娅要受不住了！');
                break;

            default:
                await e.reply('刀客塔，换个tag冲吧！');
                break;
        }
    }
}

async function fetchPictureByTagAsync(tag: string | string[], r18: boolean) {
    const tagList = typeof tag === 'string' ? tag : tag.join(' ');
    const url = r18 ? `https://pixiv-ab.tk/api/Pixiv/r18/tag/${tagList}` : `https://pixiv-ab.tk/api/Pixiv/daily/tag/${tagList}`;
    const response = await fetch(url);
    if (response.status === 200) {
        const promise = await response.json();
        return await (promise as Promise<IPicture>);
    } else {
        return response.status;
    }
}

async function fetchPictureByRandomAsync(r18: boolean) {
    const url = r18 ? `https://pixiv-ab.tk/api/Pixiv/r18/random` : `https://pixiv-ab.tk/api/Pixiv/daily/random`;
    const response = await fetch(url);
    const promise = await response.json();
    return await (promise as Promise<IPicture>);
}

interface IPicture {
    url: string;
    artist: string;
    uid: number;
    id: number;
    title: string,
    tags: string[];
}
