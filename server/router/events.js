const express = require('express');
const router = express.Router();
const Event = require('../model/eventSchema');

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
        res.status(500).json({'msg':err})
    }
    
});

router.route('/addEvent').post(async (req,res)=>{
    try{
        const event = req.body;
        // console.log("server ",event);
        const newEvent = new Event(event);
        await newEvent.save();
        console.log(`${event.title} created sucessfull`);
        res.status(201).json({"msg":"Event created sucessfully"});
    }
    catch(err){
        console.log('err',err);
        res.status(500).json({"msg":"Problem with adding event"});
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
            return res.status(201).json(null);
        }
    }catch(err){
        console.log(err);
        res.status(422).send(`${url} not found`);
    }
})

router.route('/updateEvent/:url').put(async (req,res)=>{
    try{
        const {url} = req.params;
        // console.log('req.body',req.body.url,req.body)
        const updatedEvent = await Event.findOneAndUpdate({url:url},req.body,{
            new:true
        });
        console.log('Event Updated',updatedEvent);
        res.status(200).json(updatedEvent);
    }catch (err) {
        res.status(422).json(err);
    }
});

router.route('/deleteEvent/:url').delete(async (req,res)=> {
    const {url} = req.params;

    try{
        await Event.deleteOne({url:url});
        console.log('Deleted..');
        return res.status(200).json({msg:"Event Deleted"});
    } 
    catch(err){
        console.log("Cannot Delete the Event");
        return res.status(422).json({msg:"Cannot Delete the Event"});
    }
});

module.exports = router;

