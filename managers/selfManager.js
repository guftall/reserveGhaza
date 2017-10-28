const request = require('request');
const config = require('../config');
const bluebird = require('bluebird');

const userManager = require('../managers/userManager');

//let get = bluebird.promisify(request.get)


class SelfManager{
    constructor(){
        this.loginUrl = config.urls.login
    }

    startRequest(callback){
        
        request.get(config.urls.selfUrl, (err, res)=>{
            if(err) return callback(err);

            let body = res.body
            let reg = /(src="CaptchaImage.aspx?)/
        
            let index = reg.exec(body).index
            let _url = body.substr(index+ 5, 59)
            
            index = /(id="__VIEWSTATE")/.exec(body).index
            let _VIEWSTATE = body.substr(index+ 24, 968)

            index = /(id="__VIEWSTATEGENERATOR")/.exec(body).index
            let _VIEWSTATEGENERATOR = body.substr(index + 33, 8)

            index = /(id="__EVENTVALIDATION")/.exec(body).index
            let _EVENTVALIDATION = body.substr(index + 30, 240)

            callback(null, {captchaUrl: _url, _VIEWSTATE: _VIEWSTATE, _VIEWSTATEGENERATOR: _VIEWSTATEGENERATOR, _EVENTVALIDATION: _EVENTVALIDATION})
        })
    }


    login(user, captchaText, callback){
        let formObj = Object.create({});

        formObj['__LASTFOCUS'] = ''
        formObj['__EVENTTARGET'] = ''
        formObj['__EVENTARGUMENT'] = ''
        formObj['__VIEWSTATE'] = user.session._VIEWSTATE
        formObj['btnlogin'] = '%D9%88%D8%B1%D9%88%D8%AF'
        formObj['CaptchaControl1'] = captchaText
        formObj['txtpassword'] = user.selfPassword
        formObj['txtusername'] = user.selfUsername
        formObj['__EVENTVALIDATION'] = user.session._EVENTVALIDATION
        formObj['__VIEWSTATEENCRYPTED'] = ''
        formObj['__VIEWSTATEGENERATOR'] = user.session._VIEWSTATEGENERATOR

        request.post(config.urls.login).form(formObj).on('response', (response)=>{
            console.log(response.headers)
            if(response.headers['set-cookie'] && response.headers['location'] == '/Reserve.aspx'){
                // با موفقیت وارد شده
                
                let c = response.headers['set-cookie'][0];

                let cookie = c.split(';')[0]
                user.session.cookie = cookie
                user.session.date = Date.now()

                callback(null);
            }
        })
    }

    getThisWeekGhazas(cookie, callback){

        request.get(config.urls.reserveAspx, (err, res)=>{
            console.log(res.body)
        }).setHeader('Cookie', cookie)

        index = /(window\.open\(\'Ghaza\.aspx\?date=)/;
    }
}
module.exports = SelfManager