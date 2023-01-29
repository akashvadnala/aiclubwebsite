const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
// const path = require('path');
dotenv.config({ path:'./config.env' });
const Subscribers = require('../model/subscribeSchema');

const welcomeMail = async (toaddress) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'staranirudh88477@gmail.com',
            pass: 'gkwjhetlhfbljcdn'
        }
    });

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

    // let transport = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: process.env.EMAIL_USERNAME,
    //       pass: process.env.EMAIL_PASSWORD
    //     }
    //  });

    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'staranirudh88477@gmail.com',
            pass: 'gkwjhetlhfbljcdn'
        }
    });

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


const sendMail = async (toAddress,subject,body) => {
  let transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'staranirudh88477@gmail.com',
          pass: 'gkwjhetlhfbljcdn'
      }
  });

  const mailOptions = {
      from: 'staranirudh88477@gmail.com', // Sender address
      to: toAddress, // List of recipients
      subject: subject, // Subject line
      html:body,
  };

  transport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}

module.exports = {welcomeMail, broadcastMail ,sendMail};
