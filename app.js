const request = require('request');
const config = require('./config');
const telegraf = require('telegraf');
let { Markup, Extra } = require('telegraf');

const userManager = require('./managers/userManager');
const userController = require('./controllers/userController');
const SelfManager = require('./managers/selfManager');



const bot = new telegraf(config.vars.BOT_API);


bot.use((ctx, next)=>{
    // initialize
    ctx.locals = Object.create({})

    next()
})

bot.use((ctx, next)=>{
    // Logger
    next()
})

bot.hears(/[\d]\/[\w\d]/, userController.register)

bot.use((ctx, next)=>{
    // find user

    let tID = ctx.update.message.from.id

    let user = userManager.find(tID);
    if(user){
        ctx.locals.user = user
    }
    else{

        ctx.reply(config.vars.khoshamadGui);
        return
    }

    next()
})

bot.hears(config.keyboard.reserve, ({from, reply, replyWithPhoto})=>{
    console.log(from)

    userManager.appendTo(from.id, {step: config.steps.waitForCaptchaText})

    new SelfManager().startRequest((err, fields)=>{
        userManager.appendTo(from.id, {session: fields})

        reply('لطفا متن داخل عکس را وارد کنید').then(()=>{
            replyWithPhoto({ url: `${config.urls.selfUrl}/${fields.captchaUrl}` })
        })
    })
})

bot.hears(/[\d]/, (ctx)=>{
    let user = ctx.locals.user

    if(user.step == config.steps.waitForCaptchaText){
        let s = new SelfManager()
        s.login(user, ctx.update.message.chat.text, (err)=>{
            s.getThisWeekGhazas(user.session.cookie, (err)=>{
                
            })
        })
        user.step = config.steps.nothing
    }
})


bot.use((ctx, next)=>{
    // default
    ctx.reply(`سلام ${ctx.update.message.from.username}`, Markup.keyboard)
})



bot.startPolling();
