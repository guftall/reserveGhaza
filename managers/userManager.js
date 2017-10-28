const fs = require('fs');
let ErrorManager = require('./errManager');

class UserManager{

    constructor(){
        this.timerNumber = setInterval(intervalCallback, 1000 * 2)
        try{
            let users = fs.readFileSync('./users');
            
            users = JSON.parse(users)
            
            this.users = new Map();
            for(let i in users){
                this.users.set(users[i][0], users[i][1])
            }
        }
        catch(err){
            this.users = new Map()
        }
    }

    add(tID, tUsername, selfUsername, selfPassword){
        let user = {tID: tID, tUsername: tUsername, selfUsername: selfUsername, selfPassword: selfPassword}
        this.users.set(tID, user)

        return user

    }

    remove(tID){
        let u = this.users.get(tID)

        this.users.delete(tID)
        return u;
    }

    find(tID){
        return this.users.get(tID)
    }

    appendTo(tID, obj){
        let u = this.find(tID)
        if(!u) return null;

        return Object.assign(u, obj)
    }
}

function intervalCallback(){

    fs.writeFile('./users', JSON.stringify([...exportUserManager.users]), (err)=>{
        if(err){
            ErrorManager.error(err)
        }
    })
}

let exportUserManager = new UserManager()

module.exports = exportUserManager;