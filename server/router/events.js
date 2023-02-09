const express = require('express');
const router = express.Router();
const Event = require('../model/eventSchema');
const authenticate = require("../middleware/authenticate");

router.route('/getEvents').get(async (req,res)=> {

    const upcoming = await Event.find({
        $and:[
            {eventStart:{$gt:Date()}},
            {eventEnd:{$gt:Date()}}
        ]
    });
    const ongoing = await Event.find({
        $and:[
            {eventStart:{$lte:Date()}},
            {eventEnd:{$gte:Date()}}
        ]
    });
    const past = await Event.find({
        $and:[
            {eventStart:{$lt:Date()}},
            {eventEnd:{$lt:Date()}}
        ]
    });

    const eventData = {"upcoming":upcoming,"ongoing":ongoing,"past":past};
    // console.log('eventData',eventData);
    res.status(200).json(eventData);
});

router.route('/gethomepageEvents').get(async (req,res)=>{
    try{
        let lessEvents = [];
        let ongoing = await Event.find({
            $and:[
                {eventStart:{$lte:Date()}},
                {eventEnd:{$gte:Date()}}
            ]
        }).limit(5);

        lessEvents = ongoing.map((e)=>{
            return {
                title:e.title,
                speakers:e.speakers,
                url:e.url,
                status:'ongoing'}
        })
        
        if(lessEvents.length < 5){
            
            const upcoming = await Event.find({
                $and:[
                    {eventStart:{$gt:Date()}},
                    {eventEnd:{$gt:Date()}}
                ]
            }).limit(5-lessEvents.length);
            
            const ents = upcoming.map((e)=>{
                return {
                    title:e.title,
                    speakers:e.speakers,
                    url:e.url,
                    status:'upcoming'}
            })
            lessEvents = lessEvents.concat(ents);
        }
        if(lessEvents.length < 5){
            const past = await Event.find({
                $and:[
                    {eventStart:{$lt:Date()}},
                    {eventEnd:{$lt:Date()}}
                ]
            }).limit(5-lessEvents.length);
            
            const ents = past.map((e)=>{
                return {
                    title:e.title,
                    speakers:e.speakers,
                    url:e.url,
                    status:'past'}
            })

            lessEvents = lessEvents.concat(ents);
        }
        // console.log(lessEvents);
        res.status(200).json(lessEvents);
    }
    catch(err){
        console.log(err);
        res.status(400).json({error:"Internal server error"});
    }
    
});

router.route('/addEvent').post(authenticate, async (req,res)=>{
    try{
        const event = req.body;
        console.log("Event : ",event);
        const newEvent = new Event(event);
        await newEvent.save();
        console.log(`${event.title} created sucessfull`);
        res.status(200).json({msg:"Event created sucessfully"});
    }
    catch(err){
        res.status(400).json({error:"Problem with adding event"});
    }
})

router.route('/getEvent/:url').get(async (req,res)=>{
    const {url} = req.params;
    try{
        const event = await Event.findOne({url:url});
        if(event){
            return res.status(200).json(event);
        }
        else{
            res.status(400).json({error:"Event Not Found!"});
        }
    }catch(err){
        res.status(400).json({error:"Event Not Found!"});
    }
})

router.route('/updateEvent/:url').put(authenticate, async (req,res)=>{
    try{
        const {url} = req.params;
        const updatedEvent = await Event.findOneAndUpdate({url:url},req.body,{
            new:true
        });
        console.log('Event Updated',updatedEvent);
        res.status(200).json();
    }catch (err) {
        res.status(400).json({error:"Counld not update event!"});
    }
});

router.route('/deleteEvent/:url').delete(authenticate, async (req,res)=> {
    const {url} = req.params;

    try{
        await Event.deleteOne({url:url});
        console.log('Deleted..');
        res.status(200).json({msg:"Event Deleted"});
    } 
    catch(err){
        console.log("Cannot Delete the Event");
        res.status(400).json({error:"Cannot Delete the Event!"});
    }
});

module.exports = router;

