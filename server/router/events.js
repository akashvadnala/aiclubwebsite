const express = require('express');
const router = express.Router();
const Event = require('../model/eventSchema');


router.route('/addevent').post(async (req,res)=>{
    try{
        const event = req.body;
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json({"msg":"Event created sucessfully"});
    }
    catch(err){
        console.log('err',err);
    }
    
})

router.route('/getevents').get(async (req,res)=> {
    const eventData = await Event.find({});
    console.log('eventData',eventData);
    res.status(200).json(eventData);
});


module.exports = router;

