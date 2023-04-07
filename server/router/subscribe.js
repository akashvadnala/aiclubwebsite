const express = require('express');
const router = express.Router();
const Subscribe = require('../model/subscribeSchema');
const {welcomeMail} = require('../controllers/mail');

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const isNITCmail = (email) => {
    const nitcEmailRegex = /@nitc\.ac\.in$/;

    if (nitcEmailRegex.test(email)) {
        return true;
    }
    return false;
}

router.route('/subscribe').post(async (req,res)=> {
    try {
        const data = req.body;
        if(validateEmail(data.email)){
            if(isNITCmail(data.email)){
                res.status(400).json({'error':"Please use your personal mail ID"});
                return;
            }
            else{
                let checkSubscription = await Subscribe.find({ 'email' : data.email });
                // console.log("checked",checkSubscription);
                if(checkSubscription.length === 0){
                    const subscriber = new Subscribe(data);
                    await subscriber.save();
                    welcomeMail(data.email);
                    console.log("mailcalled");
                    res.status(200).json({'msg':`subscribed sucessfully`});
                }
                else{
                    console.log("Already a subscriber")
                    res.status(200).json({'msg':"Already a subscriber"});
                } 
            }
        }
        else{
            res.status(400).json({'error':"Not a valid mail Id"});
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