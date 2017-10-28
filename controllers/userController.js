let UserManager = require('../managers/userManager');
let SelfManager = require('../managers/selfManager');
let { Markup, Extra } = require('telegraf');
const config = require('../config');



module.exports.register = (ctx)=>{

    let parts = ctx.update.message.text.split('/');

    let selfUsername = parts[0]
    let selfPassword = parts[1]

    UserManager.add(ctx.update.message.from.id, ctx.update.message.from.username, selfUsername, selfPassword)


    return ctx.reply('دستورات:',Markup
        .keyboard([config.keyboard.reserve, config.keyboard.settings])
        .oneTime()
        .resize()
        .extra()
    )
}