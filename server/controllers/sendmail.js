const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
// const path = require('path');
dotenv.config({ path:'./config.env' });
 
const sendAMail = async (toAddress,text) => {

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

     const mailOptions = {
        from: 'staranirudh88477@gmail.com', // Sender address
        to: toAddress, // List of recipients
        subject: 'Thanks for signing up for latest updates', // Subject line
        text: text, // Plain text body
    };
    
    transport.sendMail(mailOptions, function(err, info) {
       if (err) {
         console.log(err)
       } else {
         console.log(info);
       }
    });
}

module.exports = sendAMail;

