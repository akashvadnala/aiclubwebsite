const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require("fs")
const path = require("path")
dotenv.config({ path:'./config.env' });
const Subscribers = require('../model/subscribeSchema');
let ejs = require('ejs');

const transport = nodemailer.createTransport({

    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

const welcomeMail = async (toaddress) => {

    const mailOptions = {
        from: 'aiclubnitc_messenger@outlook.com', // Sender address
        to: toaddress, // List of recipients
        subject: "Thanks for signing up for Latest updates", // Subject line
        text: "This is the best desicion you have made.", // Plain text body
    };

    transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log(err)
       } else {
         console.log(info);
       }
    });
}

const broadcastMail = async (subject,body) => {

    const subsmails = await Subscribers.find({},{"_id":false,"__v":false});
    
     const mailOptions = {
        from: 'aiclubnitc_messenger@outlook.com', // Sender address
        to: subsmails, // List of recipients
        subject: subject, // Subject line
        html: body, 
    };
    
    transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log(err)
       } else {
         console.log(info);
       }
    });
}


const passwordResetMail = async (toAddress,content) => {

  const emailTemplateSource = fs.readFileSync(path.join(__dirname,'..', 'views/emails','/forgotpassword.ejs'), "utf8");
  const htmlToSend = ejs.render(emailTemplateSource,content);

  const mailOptions = {
      from: 'aiclubnitc_messenger@outlook.com', // Sender address
      to: toAddress, // List of recipients
      subject: "Reset password AI Club", // Subject line
      html:htmlToSend,
  };

  transport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}

module.exports = {welcomeMail, broadcastMail ,passwordResetMail};
