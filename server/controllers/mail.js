const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require("fs")
const path = require("path")
dotenv.config({ path: './config.env' });
const Subscribers = require('../model/subscribeSchema');
let ejs = require('ejs');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

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
      to: toaddress,
      subject: "Thanks for signing up for Latest updates", // Subject line
      text: "Greeting from AI Club NITC,\nThanks for subscribing for the latest updated from AI Club.\nStay updated with every event that happens at AI Club. ", // Plain text body
    };
    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

const broadcastMail = async (subject, body) => {
  
  try {
    const subsmails = await Subscribers.find({}, { "_id": false, "__v": false });
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
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
      to: subsmails, // List of recipients
      subject: subject, // Subject line
      text: body
    };

    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error);
  }

}


const passwordResetMail = async (toAddress, content) => {

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
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
