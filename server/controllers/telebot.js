const bot = require("../messenger/telegram")
const Telemap = require('../model/telemapSchema');

const passwordResetBot = async (content) => {
    console.log("resetpasswordBot called!");
    username = content.tele_username;
    member = await Telemap.findOne({username:username});
    chatId = member.chatid;
    if(member){
        resp = `<a href=${content.link}>Click here</a> to Reset your password`;
        console.log(bot);
        bot.sendMessage(chatId, resp);
    }
    else{
        console.log("No chatId registered for the user")
    }
}

module.exports = {passwordResetBot}