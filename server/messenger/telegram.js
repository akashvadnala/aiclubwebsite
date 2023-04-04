const TelegramBot = require('node-telegram-bot-api');
const Telemap = require('../model/telemapSchema');
const Team = require("../model/teamSchema");
const Subscribe = require("../model/subscribeSchema")

const token = '6053845485:AAG3nTmXE4xvNrbOx-lagdHFmryN7r7NdPU';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


bot.onText(/\/demo/, (msg, match) => {
    console.log('called!')
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const resp = "Hi " + username;
  console.log(bot)
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, async (msg, match) => {

    try {
        
    } catch (error) {
        bot.sendMessage(chatId,"Error")
    }

    console.log('start called!')
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    console.log("username ",msg.chat)
    const member = await Team.findOne({username:username});
    if(member){
        const newSub = new Subscribe({chatid:chatId});
        await newSub.save();
        bot.sendMessage(chatId, "Welcome to AI Club Updates");
    }
    else{
        const newMem = new Telemap({chatid:chatId,username:username});
        await newMem.save();
        bot.sendMessage(chatId, "Welcome to AI Club NITC ");
    }
    
    
});

const passwordResetBot = async (content) => {
    console.log("resetpasswordBot called!");
    let username = content.tele_username;
    let member = await Telemap.findOne({username:username});
    let chatId = member.chatid;
    let link = content.link
    if(member){
        resp = "<a href=\""+link+"/\">Click here</a>";
        console.log(link);
        bot.sendMessage(chatId, resp,{parse_mode : "HTML"});
    }
    else{
        console.log("No chatId registered for the user")
    }
}

module.exports = {bot,passwordResetBot}