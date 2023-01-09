const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let path = require('path');
const authenticate = require('../middleware/authenticate');
const Team = require('../model/teamSchema');


router.route('/').get((req,res)=>{
    res.send(`Hello world from the server router js`);
});

router.post('/login', async (req, res, next) => {
    try{
        let token;
        const { username, password } = req.body;
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
                    console.log('Logged in');
                }
                return res.status(201).json({ message: "User Signin Successfully", user:team });
            }
        });
        
    }catch(err){
        console.log('Invalid Credentials');
    }
});


// router.get('/about', authenticate, (req,res)=>{
//     console.log(`Hello my About`);
//     res.send(req.rootUser);
// });

// router.get('/contact', authenticate, (req,res)=>{
//     console.log(`Hello my Contact`);
//     res.send(req.rootUser);
// });


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


