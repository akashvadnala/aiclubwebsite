const express = require('express');
const router = express.Router();
const Subscribe = require('../model/subscribeSchema');
const {welcomeMail} = require('../controllers/mail');

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

router.route('/subscribe').post(async (req,res)=> {
    console.log("new subscription call");
    try {
        const data = req.body;
        let checkSubscription = await Subscribe.find({ 'email' : data.email });
        console.log("checked",checkSubscription);
        if(checkSubscription.length === 0){
            if(validateEmail(data.email)){
                const subscriber = new Subscribe(data);
                const name = subscriber.name;
                await subscriber.save();
                let text = `Hello ${data.name}, Thanks for subscribing for Latest Updates from AI CLUB NITC`;
                welcomeMail(data.email);
                console.log("mailcalled");
                res.status(200).json({'msg':`${name} subscribed sucessfully`});
            }
            else{
                res.status(400).json({'error':"Not a valid mail Id"});
            }
        }else{
            console.log("Already a subscriber")
            res.status(200).json({'msg':"Already a subscriber"});
        }     
        
    } catch (error) {
        console.log(`subscription error - ${error}`);
        res.status(400).json({'error':'Problem at the server. Try again after some time'});
    }   
});

router.route('/unsubscribe/:email').get(async (req,res)=> {
    const {email} = req.params.email;
    try {
        const subscriber = await Subscribe.findOneAndDelete({email:email});
        res.status(201).json({msg:`${email} has been unsubscribed sucessfully`})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Internal server ERROR"});
    }
});

module.exports = router;
