const express = require('express');
const router = express.Router();

const Competitions = require('../model/competitionSchema');
const Overview = require('../model/overviewSchema');

router.route('/getCompete/:url').get(async (req,res) => {
    const {url} = req.params;
    const data = await Competitions.findOne({url:url});
    console.log('compete',data);
    if(data){
        res.status(200).json(data);
    }
    else{
        res.status(201).json(null);
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
        const compete = new Competitions(req.body);
        await compete.save();

        const overview = new Overview({
            compete:compete._id,
            description:`This is ${compete.title} overview`
        })
        await overview.save();

        console.log(`Competition Created`);
        // res.send(`${url} created`);
        res.status(201).json({message:"Competition Created"});
    }catch(err){
        console.log('Cannot create competition',err);
        res.status(200).json({message:"Connot create competition"});

    }
});

router.route('/getCompeteNames').get(async (req,res)=>{
    const data = await Competitions.find({public:true});
    res.status(201).json(data);
});

// overview-save

router.route('/updateCompeteOverview/:url').put(async (req,res)=>{
    try{
        const {url}=req.params;
        const updateData = await Competitions.findOneAndUpdate({url:url},req.body,{
            new:true
        });
        console.log('Updated Compete',updatedData);
    }catch(err){
        console.log(err);
    }
});


module.exports = router;