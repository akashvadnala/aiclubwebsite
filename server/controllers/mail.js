const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require("fs")
const path = require("path")
dotenv.config({ path: './config.env' });
const Subscribe = require('../model/subscribeSchema');
let ejs = require('ejs');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("../Config");

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const welcomeMail = async (toaddress) => {

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'aiclub.messenger@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const emailTemplateSource = fs.readFileSync(path.join(__dirname, '..', 'views/emails', '/welcome.ejs'), "utf8");
    const htmlToSend = ejs.render(emailTemplateSource);

    const mailOptions = {
        from: 'AI Club NITC <aiclub.messenger@gmail.com>', 
        to: toaddress, 
        subject: "Thanks for signing up for Latest updates",
        html: htmlToSend,
      };
      const result = await transport.sendMail(mailOptions);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
}

const broadcastMail = async (type, content) => {
  
  try {
    const subsmails = await Subscribe.find({}, { "_id": false, "__v": false });
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'aiclub.messenger@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });
    let emailTemplateSource=""
    if(type === "blog"){
      emailTemplateSource = fs.readFileSync(path.join(__dirname, '..', 'views/emails', '/newblog.ejs'), "utf8");
    }
    else if(type === "project"){
      emailTemplateSource = fs.readFileSync(path.join(__dirname, '..', 'views/emails', '/newproject.ejs'), "utf8");
    }
    else if(type === "event"){
      emailTemplateSource = fs.readFileSync(path.join(__dirname, '..', 'views/emails', '/events.ejs'), "utf8");
    }
    
    subsmails.map((mailid)=>{
      content.link = config.SERVER_URL+"/events/"+content.link;
      content.unsub = config.SERVER_URL+"/unsubscribe/"+mailid;
      const htmlToSend = ejs.render(emailTemplateSource,content);
      const mailOptions = {
        from: 'AI Club NITC <aiclub.messenger@gmail.com>', // Sender address
        to: mailid, // List of recipients
        subject: content.subject, // Subject line
        html: htmlToSend,
      };
      const result = transport.sendMail(mailOptions);
      console.log(result);
    })
    
    } catch (error) {
      console.log(error);
    }
}


const passwordResetMail = async (toAddress, content) => {

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'aiclub.messenger@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const emailTemplateSource = fs.readFileSync(path.join(__dirname, '..', 'views/emails', '/forgotpassword.ejs'), "utf8");
    const htmlToSend = ejs.render(emailTemplateSource, content);

    const mailOptions = {
      from: 'AI Club NITC <aiclub.messenger@gmail.com>', // Sender address
      to: toAddress, // List of recipients
      subject: "Reset password AI Club",
      html: htmlToSend,
    };
    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}


const newuserMail = async (toAddress, creds)=>{
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'aiclub.messenger@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    // console.log(creds);
    let link = process.env.CLIENT_URL;
    creds.link= link;
    const emailTemplateSource = fs.readFileSync(path.join(__dirname, '..', 'views/emails', '/newUser.ejs'), "utf8");
    const htmlToSend = ejs.render(emailTemplateSource, creds);

    const mailOptions = {
      from: 'AI Club NITC <aiclub.messenger@gmail.com>', // Sender address
      to: toAddress, // List of recipients
      subject: "New Account Created",
      html: htmlToSend,
    };
    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

const generalMail = async (toAddress, subject, body) => {

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'aiclub.messenger@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });
    const mailOptions = {
      from: 'AI Club NITC <aiclub.messenger@gmail.com>', // Sender address
      to: toAddress, // List of recipients
      subject: subject, // Subject line
      text: body,
    };
    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error);
  }

}

module.exports = { welcomeMail, broadcastMail, passwordResetMail, newuserMail, generalMail };
