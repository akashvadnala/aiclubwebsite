const express = require('express');
const router = express.Router();
const Subscribe = require('../model/subscribeSchema');
const sendAMail = require('../controllers/sendmail');

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

router.route('/subscribe').post(async (req,res)=> {
    try {
        const data = req.body;
        let checkSubscription = await Subscribe.find({ 'email' : data.email });

        if(checkSubscription.length === 0){
            if(validateEmail(data.email)){
                const subscriber = new Subscribe(data);
                const name = subscriber.name;
                await subscriber.save();
                let text = `Hello ${data.name}, Thanks for subscribing for Latest Updates from AI CLUB NITC`;
                sendAMail(data.email,text);
                res.status(200).json({'msg':`${name} subscribed sucessfully`});
            }
            else{
                res.status(400).json({'msg':"Not a valid mail Id"});
            }
        }else{
            res.status(200).json({'msg':"Already a subscriber"});
        }     
        
    } catch (error) {
        console.log(`subscription error - ${error}`);
        res.status(400).json({'msg':'Problem at the server. Try again after some time'});
    }   
});

router.route('/unsubscribe/:email').get(async (req,res)=> {
    res.send('unsubscribed');
});

module.exports = router;
