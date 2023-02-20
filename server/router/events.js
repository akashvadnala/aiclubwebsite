const express = require('express');
const router = express.Router();
const Event = require('../model/eventSchema');
const authenticate = require("../middleware/authenticate");

router.route('/getEvents/:page').get(async (req, res) => {
    let page = parseInt(req.params.page);

    let ongoing = await Event.find({
        $and: [
            { eventStart: { $lte: Date() } },
            { eventEnd: { $gte: Date() } }
        ]
    }).sort({ eventStart: -1 });

    let upcoming = await Event.find({
        $and: [
            { eventStart: { $gt: Date() } },
            { eventEnd: { $gt: Date() } }
        ]
    }).sort({ eventStart: -1 });

    let past = await Event.find({
        $and: [
            { eventStart: { $lt: Date() } },
            { eventEnd: { $lt: Date() } }
        ]
    }).sort({ eventStart: -1 });

    const eventsperpage = 6;

    const numPages = Math.ceil((ongoing.length + upcoming.length + past.length) / eventsperpage);
    if(!page || page<0 || page>numPages){
        page = 1;
    }
    
    let start = (page - 1) * eventsperpage;
    let end = start + eventsperpage;
    
    if (start < ongoing.length) {
        if (ongoing.length >= end) {
            ongoing = ongoing.slice(start, end);
            upcoming = []
            past = []
        }
        else {
            end = end - ongoing.length;
            ongoing = ongoing.slice(start)
            start = 0;
            if (upcoming.length > end) {
                upcoming = upcoming.slice(start, end);
                past = []
            }
            else {
                end = end - upcoming.length;
                upcoming = upcoming.slice(start);
                start = 0;
                if (past.length >= end) {
                    past = past.slice(start, end);
                }
            }
        }
    }
    else if (start < ongoing.length + upcoming.length) {
        start = start - ongoing.length;
        end = start + eventsperpage;
        ongoing = [];
        if (upcoming.length >= end) {
            upcoming = upcoming.slice(start, end);
            past = []
        }
        else {
            end = end - upcoming.length;
            upcoming = upcoming.slice(start);
            start = 0;
            if (past.length >= end) {
                past = past.slice(start, end);
            }
        }
    }
    else if (start < ongoing.length + upcoming.length + past.length) {
        start = start - ongoing.length - upcoming.length;
        end = start + eventsperpage;
        ongoing = [];
        upcoming = [];
        if (past.length >= end) {
            past = past.slice(start, end);
        }
        else{
            past = past.slice(start);
        }
    }

    let eventData = { "ongoing": ongoing, "upcoming": upcoming, "past": past, "numPages": numPages, "page": page };
    res.status(200).json(eventData);
});

router.route('/gethomepageEvents').get(async (req, res) => {
    try {
        let lessEvents = [];
        let ongoing = await Event.find({
            $and: [
                { eventStart: { $lte: Date() } },
                { eventEnd: { $gte: Date() } }
            ]
        }).sort({ eventStart: -1 }).limit(5);

        lessEvents = ongoing.map((e) => {
            return {
                title: e.title,
                speakers: e.speakers,
                url: e.url,
                status: 'ongoing'
            }
        })

        if (lessEvents.length < 5) {

            const upcoming = await Event.find({
                $and: [
                    { eventStart: { $gt: Date() } },
                    { eventEnd: { $gt: Date() } }
                ]
            }).sort({ eventStart: -1 }).limit(5 - lessEvents.length);

            const ents = upcoming.map((e) => {
                return {
                    title: e.title,
                    speakers: e.speakers,
                    url: e.url,
                    status: 'upcoming'
                }
            })
            lessEvents = lessEvents.concat(ents);
        }
        if (lessEvents.length < 5) {
            const past = await Event.find({
                $and: [
                    { eventStart: { $lt: Date() } },
                    { eventEnd: { $lt: Date() } }
                ]
            }).sort({ eventStart: -1 }).limit(5 - lessEvents.length);

            const ents = past.map((e) => {
                return {
                    title: e.title,
                    speakers: e.speakers,
                    url: e.url,
                    status: 'past'
                }
            })

            lessEvents = lessEvents.concat(ents);
        }
        res.status(200).json(lessEvents);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: "Internal server error" });
    }

});

router.route("/isEventUrlExist/:url").get(async (req, res) => {
    const { url } = req.params;
    Event.findOne({ url: url }).then(data => {
      return data ? res.status(404).send({ error: "Url Already Exist!" }) : res.status(200).json();
    })
  })

router.route('/addEvent').post(authenticate, async (req,res)=>{
    try{
        const event = req.body;
        event.url = event.url.trim().replace(/\s+/g, '-').toLowerCase();
        const newEvent = new Event(event);
        await newEvent.save();
        console.log(`${event.title} created sucessfull`);
        res.status(200).json({ msg: "Event created sucessfully", url: newEvent.url });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: "Problem with adding event" });
    }
})

router.route('/getEvent/:url').get(async (req, res) => {
    const { url } = req.params;
    try {
        const event = await Event.findOne({ url: url });
        if (event) {
            return res.status(200).json(event);
        }
        else {
            res.status(404).json({ error: "Event Not Found!" });
        }
    } catch (err) {
        res.status(404).json({ error: "Event Not Found!" });
    }
})

router.route('/updateEvent/:url').put(authenticate, async (req, res) => {
    try {
        const { url } = req.params;
        const updatedEvent = await Event.findOneAndUpdate({ url: url }, req.body, {
            new: true
        });
        res.status(200).json();
    } catch (err) {
        res.status(400).json({ error: "Counld not update event!" });
    }
});

router.route('/deleteEvent/:url').delete(authenticate, async (req, res) => {
    const { url } = req.params;

    try {
        await Event.deleteOne({ url: url });
        console.log('Deleted..');
        res.status(200).json({ msg: "Event Deleted" });
    }
    catch (err) {
        console.log("Cannot Delete the Event");
        res.status(400).json({ error: "Cannot Delete the Event!" });
    }
});

module.exports = router;

