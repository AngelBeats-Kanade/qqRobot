import knex from 'knex';
import * as fs from 'fs';
import {bot} from './plugin-bot.js';

const config = {
    client: 'better-sqlite3',
    connection: {
        filename: './data/coc_characters.db'
    }
};

const skillList: SkillList = JSON.parse(fs.readFileSync('resource/skills.json').toString());
const characteristicList: CharacteristicList = JSON.parse(fs.readFileSync('resource/characteristics.json').toString());
const skillGroups = ['common', 'uncommon', 'art_and_craft', 'science', 'fighting', 'firearms', 'modern'];

const knexInstance = knex.knex(config);

await initialize();

bot.on('message', async function (e) {
    if (e.raw_message.startsWith('.st ') || e.raw_message.startsWith('。st ')) {
        const data = e.raw_message.substring(4);
        const owner = e.sender.user_id.toString();
        const characteristics_and_skills = data.split(/\d+/i).filter(item => item !== '');
        const numbers = data.split(/\D+/i).filter(item => item !== '');

        await knexInstance('characters').where('owner', owner).update('enable', false);

        const exist_characters_num = (await knexInstance('characters').where('owner', owner).count('owner'))[0]['count(`owner`)'];

        const insertedRow = await knexInstance('characters').insert({
            owner: owner,
            name: owner + '_' + exist_characters_num,
            enable: true
        });

        for (const group of skillGroups) {
            await knexInstance(group).insert({
                character_id: insertedRow[0]
            })
        }

        for (let i = 0; i < characteristics_and_skills.length; i++) {
            if (characteristics_and_skills[i] in characteristicList) {
                await knexInstance('characters').where('id', insertedRow[0]).update(characteristicList[characteristics_and_skills[i]].name, numbers[i]);
            }

            if (characteristics_and_skills[i] in skillList) {
                await knexInstance(skillList[characteristics_and_skills[i]].group).where('character_id', insertedRow[0]).update(skillList[characteristics_and_skills[i]].name, numbers[i]);
            }
        }

        const dex = parseInt(numbers[characteristics_and_skills.findIndex(e => e === '敏捷')]);
        const str = parseInt(numbers[characteristics_and_skills.findIndex(e => e === '力量')]);
        const siz = parseInt(numbers[characteristics_and_skills.findIndex(e => e === '体型')]);
        const mov = ((): number => {
            if (dex < siz && str < siz) {
                return 7;
            } else if (dex > siz && str > siz) {
                return 9;
            } else {
                return 8;
            }
        })();
        await knexInstance('characters').where('id', insertedRow[0]).update('mov', mov);

        await e.reply('刀客塔，您的数据已经成功储存！');
    }
})

async function setCharacteristic(owner: string, characteristic: string, num: number): Promise<number> {
    return knexInstance('characters').where('owner', owner).andWhere('enable', true).update(characteristicList[characteristic].name, num);
}

async function setSkill(owner: string, skill: string, num: number): Promise<number> {
    const id = (await knexInstance('characters').where('owner', owner).andWhere('enable', true).select('id'))[0]['id'];

    return knexInstance(skillList[skill].group).where('character_id', id).update(skillList[skill].name, num);
}

async function getCharacteristic(owner: string, characteristic: string): Promise<number> {
    const result = await knexInstance('characters').where('owner', owner).andWhere('enable', true).select(characteristicList[characteristic].name);

    return result[0][characteristicList[characteristic].name];
}

async function getSkill(owner: string, skill: string): Promise<number> {
    const id = (await knexInstance('characters').where('owner', owner).andWhere('enable', true).select('id'))[0]['id'];
    const result = await knexInstance(skillList[skill].group).where('character_id', id).select(skillList[skill].name);

    return result[0][skillList[skill].name];
}

async function initialize() {
    const exists = await knexInstance.schema.hasTable('characters');

    if (!exists) {
        try {
            await knexInstance.schema.createTable('characters', (table) => {
                table.increments('id');
                table.string('owner');
                table.boolean('enable');
                table.string('name');
                table.integer('mov').unsigned();
                for (const characteristic in characteristicList) {
                    table.integer(characteristicList[characteristic].name).unsigned();
                }
            });

            for (const group of skillGroups) {
                await knexInstance.schema.createTable(group, (table) => {
                    table.increments('id');
                    table.integer('character_id').references('id').inTable('characters');
                    for (const skill in skillList) {
                        if (skillList[skill].group === group) {
                            table.integer(skillList[skill].name).unsigned();
                        }
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}

interface SkillList {
    [key: string]: Skill;
}

interface CharacteristicList {
    [key: string]: Characteristic;
}

interface Skill extends Characteristic {
    group: string;
}

interface Characteristic {
    name: string;
}

export {getSkill, setSkill, getCharacteristic, setCharacteristic, skillList, characteristicList};
