const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require("fs")
const path = require("path")
dotenv.config({ path:'./config.env' });
const Subscribers = require('../model/subscribeSchema');
let ejs = require('ejs');

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "80d4f60db91708",
    pass: "33b404ee506e54"
  }
});

const welcomeMail = async (toaddress) => {

    const mailOptions = {
        from: 'staranirudh88477@gmail.com', // Sender address
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
        from: 'staranirudh88477@gmail.com', // Sender address
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
      from: 'staranirudh88477@gmail.com', // Sender address
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
