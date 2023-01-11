const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let path = require('path');
const authenticate = require('../middleware/authenticate');
const Leaderboard = require('../model/leaderboardSchema');
const Team = require('../model/teamSchema');
 

router.route('/').get((req,res)=>{
    res.send(`Hello world from the server router js`);
});

router.post('/login', async (req, res, next) => {
    try{
        let token;
        const { username, password, compete } = req.body;
        console.log(username, password);
        if(!username || !password){
            return res.status(200).json({ error: "Plz fill the field properly" });
        }
        var team = await Team.findOne({ username:username });
        if(!team){
            team = await Team.findOne({ email:username });
            if(!team){
                return res.status(200).json({ error: "Invalid Credentials" });
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
                    res.cookie('jwtoken',token,{  // jwtoken->name
                        expires: new Date(Date.now() + 258920000000), //30 days
                        httpOnly: true
                    });
                    if(compete){
                        const leaderboard = new Leaderboard({
                            compete:compete,
                            name:team.username
                        });
                        await leaderboard.save();
                        team.competitions.push(compete);
                        await team.save();
                    }
                    console.log('Logged in');
                }
                return res.status(201).json({ message: "User Signin Successfully", user:team });
            }
        });
        
    }catch(err){
        console.log('Invalid Credentials');
    }
});

router.route('/competesignup').post(async (req,res)=>{
    try{
        let teamExist = await Team.findOne({email:req.body.email});
        if(teamExist){
            console.log("Email already exist");
            return res.status(201).json({ error: "Email already exist" });
        }
        teamExist = await Team.findOne({username:req.body.username});
        if(teamExist){
            console.log("Username already exist");
            return res.status(201).json({ error: "Username already exist" });
        }
        console.log('team',req.body);
        const team =  new Team(req.body); 
        const saltRounds = 10;   
        team.password = await bcrypt.hash(team.password,saltRounds);
        await team.save();
        let token = await team.generateAuthToken();
        console.log('token',token);
        res.cookie('jwtoken',token,{  // jwtoken->name
            expires: new Date(Date.now() + 258920000000), //30 days
            httpOnly: true
        });
        console.log('Logged in');
        console.log(`${team.username} user registered successfully`);
        res.status(200).json({ message: "user Login Successfully" });
    }catch(err){
        console.log('Team Cannot Create',err);
    }
});


router.get('/getUserData', authenticate, (req,res)=>{
    // console.log(`Hello ${req.rootUser?req.rootUser.username:'Not logged in'}`);
    if(req.rootUser){
        res.status(200).json(req.rootUser);
    }
    else{
        res.status(201).json(null);
    }
});

router.get('/logout', (req,res)=>{
    res.clearCookie('jwtoken',{path:'/'});
    res.clearCookie('cjwtoken',{path:'/'});
    res.status(200).send({msg:'Logged Out Succesfully'});
});

module.exports = router;


