const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
let path = require('path');
const authenticate = require('../middleware/authenticate');

const Team = require('../model/teamSchema');
const File = require('../model/fileSchema');

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


router.route('/imgupload').post(multer({ storage }).single('photo'), async (req, res) => {
    // if(req.file === null){
    //     return res.status(400).json({ msg: "No file uploaded" });
    // }
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
        console.log('img-url',fileDoc.url);
        return res.status(200).send(url);
    }catch(err){
        console.log(err);
    }
});

router.route('/imgdelete').post(async (req,res)=>{
    try {
        const url = req.body.url;
        const key =  url.split('=')[2];
        
        const stats = await fileUpload.deleteFile(key);
        
        const count= await File.deleteOne({ imgurl: {url} });
        console.log('Old Image Deleted');
        res.status(200).json({"msg":"Image deleted sucessfully"});
    } catch (error) {
        console.log(error);
        res.status(422).json({"msg":"Error while deleting Images"})
    }
});


router.route('/teamadd').post(async (req,res) => {
    // const {  firstname,lastname,profession,description,username,email,password,cpassword } = req.body;
    console.log('body');
    const photo = req.body.photo;
    console.log('photo',photo);
    console.log("Registering..");
    try{
        const teamExist = await Team.findOne({email:email});
        
        if(teamExist){
            return res.status(201).json({ error: "Email already exist" });
        }else if(password != cpassword){
            return res.status(201).json({ error: "Passwords not matched" });
        }

        const team = new Team(req.body);

        const saltRounds = 10;
        team.password = await bcrypt.hash(password,saltRounds);
        team.cpassword = team.password;
        await team.save();

        console.log(`${team} user registered successfully`);
        res.status(201).json({ message: "user Login Successfully" });
        
    }catch(err){
        console.log('err',err);
    }  
});

router.route('/getTeams').get(async (req,res)=>{
    let users=[];
    const teams = await Team.find({ismember:true});
    await Promise.all(
        teams.map(t=>users.push(t.username))
    );
    return res.status(200).json(users);
})

router.route('/getTeam/:year').get(async (req,res)=>{
    let teamData = [];
    const {year} = req.params;  
    const d=new Date();
    var y=d.getFullYear();
    if(parseInt(year)===y+1){
        teamData = await Team.find({ismember:true,isalumni:false});
    }
    else{
        teamData = await Team.find({ismember:true,isalumni:true,year:year});
    }
    // await Promise.all(
    //     teamData.map((t)=>{Object.assign(t,{year:2023})})
    // );
    res.status(201).json(teamData);
});


router.route('/getArchTeam').get(async (req,res)=>{
    const teamData = await Team.find({ismember:false});
    // console.log(teamData);
    res.status(201).json(teamData);
});


router.route('/getUserDataForEdit/:username').get(async (req,res)=>{
    const {username} = req.params;
    try{    
        
        const user = await Team.findOne({username:username});
        // console.log(teamData);
        if(user){
            return res.status(200).json(user);
        }
        else{
            return res.status(201).json(null);
        }
    }catch(err){
        console.log(err);
        res.status(201).send(`${username} not found`);
    }
});


router.route('/teamupdate/:username').put(async (req,res)=>{
    try {
        const {username} = req.params;

        const updateduser = await Team.findOneAndUpdate({username:username},req.body,{
            new:true
        });

        console.log('Team Updated!');
        res.status(201).json(updateduser);

    } catch (error) {
        res.status(201).json(error);
    }
});


router.route('/team/delete/:username').post(async (req, res) => {
    const {username} = req.params;
    const team = await Team.findOne({ username: username });
    if(team){
        const projects = team.projects;
        await Promise.all(projects.map(async p=>{
            const proj = await Project.findOne({url:p});
            proj.authors = proj.authors.filter(t=>t!==username);
            await proj.save();
        }))
        await Team.deleteOne({ username: username });
        console.log('Deleted..');
        return res.status(201).json({ message: "Team Member Deleted Successfully"});
    }
    else{
        return res.status(200).json({ error: "Cannot Delete Team Member"});
    }
})

module.exports = router;


