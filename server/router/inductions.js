const express = require('express');
const router = express.Router();

const Competitions = require('../model/competitionSchema');

router.route('/getCompete/:url').get(async (req,res) => {
    const {url} = req.params;
    const data = await Competitions.findOne({url:url});
    console.log('compete',data);
    if(data){
        res.status(201).json(data);
    }
    else{
        res.status(200).json(null);
    }
});

router.route('/competitions').post(async (req,res) => {
    const title = req.body.title;
    const description = req.body.description;
    const url = req.body.url;
    const public = req.body.public;
    const navs=[];
    const competeExist = await Competitions.findOne({url:url});
    console.log('exist',competeExist);
    if(competeExist){
        return res.status(422).json({error:"Competition Already Exist"});
    }
    try{
        const compete = new Competitions({
            url:url,
            title:title,
            description:description,
            public:public,
            navs:navs
        });
        await compete.save();

        console.log(`Competition Created`);
        // res.send(`${url} created`);
        res.status(201).json({message:"Competition Created"});
    }catch(err){
        console.log('Cannot create competition');
        res.status(200).json({message:"Connot create competition"});

    }
});

router.route('/getCompeteNames').get(async (req,res)=>{
    const data = await Competitions.find({public:true});
    console.log('data',data);
    res.status(201).json(data);
});


module.exports = router;