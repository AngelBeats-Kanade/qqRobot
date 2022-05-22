### [oicq](https://github.com/takayama-lily/oicq) QQ机器人
* QQ(安卓)协议基于Node.js的实现，支持最低node版本为 v16
* 若你不熟悉Node.js或不会组织代码，可通过 [oicq-template](https://github.com/takayama-lily/oicq-template) 创建一个简单的应用程序
* [API Reference](#api-reference) / [Type Docs](https://takayama-lily.github.io/oicq/) (文档仅供参考，具体类型以包内d.ts声明文件为准)
* [从v1.x升级](https://github.com/takayama-lily/oicq/projects/3#column-16638290)

----

**Feature:**
1. 拓展了骰娘的功能，支持今日人品和塔罗牌抽卡
2. 支持通过`.st`命令设置COC人物卡
3. 支持用tag搜索[Pixiv](https://pixiv.net)图片

----

**Usage:**

1. 安装 [Node.js](https://nodejs.org/) 16以上版本
2. 安装 [TypeScript](https://www.typescriptlang.org/) : `npm install typescript -g`
3. clone到本地并执行 `npm i` 安装依赖
4. 将 src/plugin-bot.ts 第2行 `const account = ***` 中的***改为你自己的账号
5. 将 src/plugin-bot.ts 第3行 `const password = ***` 中的***改为你自己的密码
6. 执行 `npm run build` 编译程序
7. 执行 `npm run dev` 启动程序

----

> 如果你是初学者，建议通过下面的资料提升自己：
[JavaScript语言基础](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) / [现代JavaScript教程](https://zh.javascript.info)
[Node.js入门教程](http://nodejs.cn/learn)
[5分钟上手TypeScript](https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html)
[优秀npm三方库集合](https://github.com/sindresorhus/awesome-nodejs)
