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
        res.status(500).json({msg:"Internal server error"});
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
        if(req.body.password != req.body.cpassword){
            return res.status(201).json({ error: "Passwords not matched" });
        }

        const mailExist = await Team.findOne({email:req.body.email});
        
        if(mailExist){
            return res.status(201).json({ error: "Email already exist" });
        }

        const userExist = await Team.findOne({username:req.body.username});
        
        if(userExist){
            return res.status(201).json({ error: "Username already exist" });
        }
        
        const team = new Team(req.body);

        const saltRounds = 10;
        team.password = await bcrypt.hash(req.body.password,saltRounds);
        await team.save();

        console.log(`${team.username} user registered successfully`);
        res.status(201).json({ message: "user Login Successfully" });
        
    }catch(err){
        console.log('err',err);
        res.status(500).json({msg:"Internal server error"});
    }  
});

router.route('/getTeams').get(async (req,res)=>{
    let teams = [];
    const team = await Team.find({ismember:true});
    await Promise.all(team.map(t=>{
        teams.push({id:t._id,name:`${t.firstname} ${t.lastname}`})
    }))
    // console.log('teams',teams);
    return res.status(200).json(teams);
});

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


router.route('/teamupdate/:id').put(async (req,res)=>{
    try {
        const {id} = req.params;

        const updateduser = await Team.findByIdAndUpdate(id,req.body,{
            new:true
        });

        console.log('Team Updated!');
        res.status(200).json(updateduser);

    } catch (error) {
        res.status(201).json(error);
    }
});

router.route('/changePassword/:id').put(async (req,res)=>{
    try {
        const {id} = req.params;
        const {password,newPassword,cPassword} = req.body;
        if(newPassword!==cPassword){
            return res.status(201).json({ error: "Password Not Matched" });
        }
        let team = await Team.findById(id);

        bcrypt.compare(password, team.password, async (err,isMatch) => {
            if(!isMatch){
                console.log('Invalid Credentials');
                return res.status(201).json({ error: "Invalid Credentials" });
            }
            else{
                console.log('Changing password..')
                const saltRounds = 10;
                team.password = await bcrypt.hash(newPassword,saltRounds);
                team.tokens = [];
                await team.save();
                token = await team.generateAuthToken();
                res.cookie('jwtoken',token,{  
                    expires: new Date(Date.now() + 258920000000), //30 days
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
                console.log('Password Changed Successfully');
                return res.status(200).json({ msg: "Password Updated Successfully"});
            }
        });

    } catch (error) {
        res.status(201).json(error);
    }
});


router.route('/team/delete/:id').post(async (req, res) => {
    const {id} = req.params;
    const team = await Team.findById(id);
    if(team){
        const projects = team.projects;
        await Promise.all(projects.map(async p=>{
            const proj = await Project.findById(p);
            proj.authors = proj.authors.filter(t=>t!==id);
            await proj.save();
        }))
        await Team.findByIdAndDelete(id);
        console.log('Deleted..');
        res.status(201).json({ message: "Team Member Deleted Successfully"});
    }
    else{
        res.status(200).json({ error: "Cannot Delete Team Member"});
    }
})

module.exports = router;


