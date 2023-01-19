const express = require('express');
const router = express.Router();

const Rules = require('../model/rulesSchema');

router.route('/getRules/:url').get(async (req,res)=>{
    try{
        const data = await Rules.findOne({compete:req.params.url});
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(201).json(null);
        }
    }catch(err){
        console.log('err');
    }
    
})

router.route('/editRules/:id').put(async (req,res)=>{
    try{
        const updatedRules = await Rules.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        console.log('Updated Rules',updatedRules);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;