const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const CTeam = require('../model/CTeamSchema');
const competeAuthenticate = require('../middleware/competeAuthenticate');

router.route('/competesignup').post(async (req,res)=>{
    try{
        let teamExist = await CTeam.findOne({email:req.body.email});
        if(teamExist){
            console.log("Email already exist");
            return res.status(422).json({ error: "Email already exist" });
        }
        teamExist = await CTeam.findOne({username:req.body.username});
        if(teamExist){
            console.log("Username already exist");
            return res.status(422).json({ error: "Username already exist" });
        }
        console.log('team',req.body);
        const team =  new CTeam(req.body); 
        const saltRounds = 10;   
        team.password = await bcrypt.hash(team.password,saltRounds);
        await team.save();

        console.log(`${team.username} user registered successfully`);
        res.status(200).json({ message: "user Login Successfully" });
    }catch(err){
        console.log('CTeam Cannot Create',err);
    }
});

router.route('/competelogin').post(async (req,res,next)=>{
    try{
        const {username,password} = req. body;
        console.log(username,password);
        var team = await CTeam.findOne({username:username});
        if(!team){
            team = await CTeam.findOne({email:username});
            if(!team){
                return res.status(200).json({error:"Invalid Credentials"});
            }
        }
        bcrypt.compare(password, team.password, async (err,isMatch) => {
            console.log('isMatch',isMatch);
            if(!isMatch){
                console.log('password not matched');
                return res.status(200).json({ error: "Invalid Credentials" });
            }
            else{
                if(team){
                    token = await team.generateAuthToken();
                    res.cookie('cjwtoken',token,{  // jwtoken->name
                        expires: new Date(Date.now() + 258920000000), //30 days
                        httpOnly: true
                    });
                    console.log('Logged in');
                }
                return res.status(201).json({ message: "User Signin Successfully", user:team });
            }
        });
    }catch(err){
        console.log(err);
    }
});

router.get('/getCUserData', competeAuthenticate, (req,res)=>{
    if(req.rootUser){
        res.status(200).json(req.rootUser);
    }
    else{
        res.status(201).json(null);
    }
});

router.get('/competelogout', (req,res)=>{
    res.clearCookie('cjwtoken',{path:'/'});
    res.status(200).send({msg:'Logged Out Succesfully'});
});

module.exports = router;