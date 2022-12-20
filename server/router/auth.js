const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let path = require('path');
const authenticate = require('../middleware/authenticate');

require('../db/conn');
const Team = require('../model/teamSchema');
const File = require('../model/fileSchema');
const Competitions = require('../model/competitionSchema');
// console.log('Competitions',Competitions.obj);
// console.log('Team',Team.findOne({email:'akashvadanala123@gmail.com'}));

router.route('/getCompete/:url').get(async (req,res) => {
    console.log('params',req.params);
    const url = req.params.url;
    // const path = req.params.path;
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

router.route('/').get((req,res)=>{
    res.send(`Hello world from the server router js`);
});

const mime = require("mime-types");
const { Readable } = require("stream");

const fs = require('fs');
const { google } = require('googleapis');

const GOOGLE_API_FOLDER_ID = '1K5UVYYZS6PrDEJRX6QfVj8d7Ng-tBtY0';

const bufferToStream = (buffer) => {
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);
  
    return stream;
};

const { InitFileUpload } = require('../file_upload');
const multer = require('multer');
const { json } = require('stream/consumers');

const fileUpload = InitFileUpload();


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb)=> {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb)=>{
    if( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else {
        cb(null, false)
    }
}

const upload = multer({ storage, fileFilter }).single('photo');

const imgupload = async (req, res) => {
    if(req.file === null){
        return res.status(400).json({ msg: "No file uploaded" });
    }
    console.log('files',req.body);
    const file = req.file.path;
    const name = req.file.filename;
    console.log('name',name);
    console.log('file',file);
    const mimeType = req.file.mimetype;

    try{
        const key = await fileUpload.uploadFile({ name, file, mimeType });
        const url = fileUpload.getUrl(key);

        const fileDoc = new File({
            'key':key,
            'name':name,
            'url':url
        });
        await fileDoc.save();

        return res.status(200).send(url);
    }catch(err){
        console.log(err);
    }
}

router.route('/imgupload').post(upload, imgupload);

const teamadd = async (req,res) => {
    // const {  firstname,lastname,profession,description,username,email,password,cpassword } = req.body;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const profession = req.body.profession;
    const description = req.body.description;
    const username = req.body.username;
    const email = req.body.email;
    const year = req.body.year;
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const isadmin = req.body.isadmin;
    const ismember = req.body.ismember;
    console.log('body');
    const photo = req.body.photo;
    console.log('photo',photo);
    if( !firstname || !lastname || !profession || !description || !username || !email || !year || !password || !cpassword || !photo){
        return res.status(400).json({ error: "Plz fill the field properly" });
    }
    console.log("Registering..");
    try{
        const teamExist = await Team.findOne({email:email});
        
        if(teamExist){
            return res.status(422).json({ error: "Email already exist" });
        }else if(password != cpassword){
            return res.status(422).json({ error: "Passwords not matched" });
        }

        const team = new Team({ 
            firstname:firstname, 
            lastname:lastname,  
            profession:profession,
            description:description,
            username:username,
            email:email, 
            photo:photo,
            year:year,
            password:password,
            cpassword:cpassword,
            isadmin:isadmin,
            ismember:ismember,
            canCreateCompetitions:canCreateCompetitions
        });

        const saltRounds = 10;
        team.password = await bcrypt.hash(password,saltRounds);
        team.cpassword = team.password;
        await team.save();

        console.log(`${team} user registered successfully`);
        res.status(201).json({ message: "user Login Successfully" });
        
    }catch(err){
        console.log('err',err);
    }  
}

router.route('/teamadd').post(teamadd);

const getTeam = async (req,res)=>{
    const teamData = await Team.find({ismember:true});
    res.status(201).json(teamData);
}

router.route('/getTeam').get(getTeam);

const getArchTeam = async (req,res)=>{
    const teamData = await Team.find({ismember:false});
    // console.log(teamData);
    res.status(201).json(teamData);
}

router.route('/getArchTeam').get(getArchTeam);

getusernameforedit_username = async (req,res)=>{
    const {username} = req.params;
    try{    
        
        const user = await Team.findOne({username:username});
        // console.log(teamData);
        if(user){
            return res.status(200).json(user);
        }
        else{
            return res.status(201).json(user);
        }
    }catch(err){
        console.log(err);
        res.status(422).send(`${username} not found`);
    }
}

router.route('/getUserDataForEdit/:username').get(getusernameforedit_username);

const teamupdate_username = async (req,res)=>{
    try {
        const {username} = req.params;

        const updateduser = await Team.findOneAndUpdate({username:username},req.body,{
            new:true
        });

        console.log('Team Updated!');
        res.status(201).json(updateduser);

    } catch (error) {
        res.status(422).json(error);
    }
}

router.route('/teamupdate/:username').put(teamupdate_username);

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
            console.log('team',team);
            team = await Team.findOne({ email:username });
            console.log('team',team);
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
                console.log('No error');
                if(team){
                    token = await team.generateAuthToken();
                    console.log('token',token);
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

router.route('/team/delete/:username').post(async (req, res) => {
    const {username} = req.params;
    const team = await Team.findOne({ username: username });
    if(team){
        await Team.deleteOne({ username: username });
        console.log('Deleted..');
        return res.status(201).json({ message: "Team Member Deleted Successfully"});
    }
    else{
        return res.status(200).json({ error: "Cannot Delete Team Member"});
    }
})

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
    res.send(req.rootUser);
});

router.get('/logout', (req,res)=>{
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send({msg:'Logged Out Succesfully'});
});


module.exports = router;


