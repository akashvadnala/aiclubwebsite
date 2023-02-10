const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const authenticate = require('../middleware/authenticate');
const Team = require('../model/teamSchema');
const File = require('../model/fileSchema');
const {generalMail} = require('../controllers/mail');

router.route('/').get((req, res) => {
    res.send(`Hello world from the server router js`);
});

// const mime = require("mime-types");
// const { Readable } = require("stream");

// const { google } = require('googleapis');

// const GOOGLE_API_FOLDER_ID = '1K5UVYYZS6PrDEJRX6QfVj8d7Ng-tBtY0';


const { InitFileUpload } = require('../file_upload');
const fileUpload = InitFileUpload();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }  
})

router.route('/imgupload').post(multer({ storage }).single('photo'), async (req, res) => {
    // if(req.file === null){
    //     return res.status(400).json({ msg: "No file uploaded" });
    // }
    // console.log('files', req.file);
    const file = req.file.path;
    const name = req.file.filename;
    const mimeType = req.file.mimetype;

    try {
        const key = await fileUpload.uploadFile({ name, file, mimeType });
        const url = fileUpload.getUrl(key);
        res.send(url);
    } catch (err) {
        res.status(400).json({ error: "Something went wrong!" });
    }
});

router.route('/imgdelete').post(authenticate, async (req, res) => {
    try {
        const url = req.body.url;
        const key = url.split('=')[2];

        await fileUpload.deleteFile(key);

        await File.deleteOne({ imgurl: { url } });
        console.log('Old Image Deleted');
        res.status(200).json({ "msg": "Image deleted sucessfully" });
    } catch (error) {
        console.log(error);
        res.status(422).json({ "msg": "Error while deleting Images" })
    }
});

router.route('/isUsernameExist/:username').get(async (req, res) => {
    const userExist = await Team.findOne({ username: req.params.username });

    if (userExist) {
        return res.status(401).json({ error: "Username already exist!" });
    }
    res.status(200).json();
})

router.route('/isEmailExist/:email').get(async (req, res) => {
    const mailExist = await Team.findOne({ email: req.params.email });

    if (mailExist) {
        return res.status(401).json({ error: "Email already exist!" });
    }

    res.status(200).json();
})


router.route('/teamadd').post(authenticate, async (req, res) => {
    try {
        if (req.body.password != req.body.cpassword) {
            return res.status(401).json({ error: "Passwords not matched!" });
        }

        const mailExist = await Team.findOne({ email: req.body.email });

        if (mailExist) {
            return res.status(401).json({ error: "Email already exist!" });
        }

        const userExist = await Team.findOne({ username: req.body.username });

        if (userExist) {
            return res.status(401).json({ error: "Username already exist!" });
        }

        const team = new Team(req.body);

        const saltRounds = 10;
        team.password = await bcrypt.hash(req.body.password, saltRounds);
        await team.save();
        
        const subject = "";
        const body=`Greetings from AI Club \n 
        As you are a part of AI Club NITC, a new account has been in the AI CLUB Website./n 
        Your credentials are:\n
        Username: ${team.username}\n
        Password:${team.password}\n
        Login to change your account details.\n
        Regards\n
        AI Club NITC`;
        generalMail(team.email,subject,body);
        console.log(`${team.username} user registered successfully`);
        res.status(200).json({ message: "user Login Successfully" });

    } catch (err) {
        console.log('err', err);
        res.status(400).json({ error: "Internal server error" });
    }
});

router.route('/getTeams').get(async (req, res) => {
    let teams = [];
    const team = await Team.find({ ismember: true });
    await Promise.all(team.map(t => {
        teams.push({ id: t._id, name: `${t.firstname} ${t.lastname}` })
    }))
    return res.status(200).json(teams);
});

router.route('/getTeam/:year').get(async (req, res) => {
    let teamData = [];
    const { year } = req.params;
    const d = new Date();
    var y = d.getFullYear();
    if (parseInt(year) === y + 1) {
        teamData = await Team.find({ ismember: true, isalumni: false });
    }
    else {
        teamData = await Team.find({ ismember: true, isalumni: true, year: year });
    }
    res.status(200).json(teamData);
});

router.route('/getArchTeam').get(async (req, res) => {
    const teamData = await Team.find({ ismember: false });
    res.status(200).json(teamData);
});



router.route('/getUserDataForEdit/:username').get(async (req, res) => {
    const { username } = req.params;
    try {
        const user = await Team.findOne({ username: username });

        if (user) {
            return res.status(200).json(user);
        }
        else {
            return res.status(400).json({ error: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "User not found" });
    }
});


router.route('/teamupdate/:id').put(authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const updateduser = await Team.findByIdAndUpdate(id, req.body, {
            new: true
        });

        console.log('Team Updated!');
        res.status(200).json(updateduser);

    } catch (error) {
        res.status(400).json({error:"Somthing went wrong!"});
    }
});

router.route('/changePassword/:id').put(authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { password, newPassword, cPassword } = req.body;
        if (newPassword !== cPassword) {
            return res.status(201).json({ error: "Password Not Matched" });
        }
        let team = await Team.findById(id);

        bcrypt.compare(password, team.password, async (err, isMatch) => {
            if (!isMatch) {
                console.log('Invalid Credentials');
                return res.status(201).json({ error: "Invalid Credentials" });
            }
            else {
                console.log('Changing password..')
                const saltRounds = 10;
                team.password = await bcrypt.hash(newPassword, saltRounds);
                team.tokens = [];
                await team.save();
                token = await team.generateAuthToken();
                res.cookie('jwtoken', token, {
                    expires: new Date(Date.now() + 258920000000), //30 days
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
                console.log('Password Changed Successfully');
                return res.status(200).json({ msg: "Password Updated Successfully" });
            }
        });

    } catch (error) {
        res.status(400).json({error:"Somthing went wrong!"});
    }
});


router.route('/team/delete/:id').delete(authenticate, async (req, res) => {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (team) {
        const projects = team.projects;
        await Promise.all(projects.map(async p => {
            const proj = await Project.findById(p);
            proj.authors = proj.authors.filter(t => t !== id);
            await proj.save();
        }))
        await Team.findByIdAndDelete(id);
        res.status(200).json();
    }
    else {
        res.status(401).json({ error: "Cannot Delete Team Member" });
    }
})

module.exports = router;


