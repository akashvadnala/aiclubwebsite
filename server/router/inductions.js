const express = require("express");
const router = express.Router();
const multer = require('multer');
const Competitions = require("../model/competitionSchema");
const UserSubmission = require("../model/userSubmissionSchema");
const Leaderboard = require("../model/leaderBoardSchema");
const competeAuthenticate = require("../middleware/competeAuthenticate");
const Team = require("../model/teamSchema");
const CompeteUser = require("../model/competeTeamSchema");
const authenticate = require("../middleware/authenticate");
const celery = require("../celery");
const logger = require("../log");
const fs = require('fs');
const Config = require('../Config');

router.route("/getCompete/:url").get(async (req, res) => {
  const { url } = req.params;
  const data = await Competitions.findOne({ url: url });
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(400).json();
  }
});

router.route("/getCompeteDetails/:id").get(async (req, res) => {
  const { id } = req.params;
  const data = await Competitions.findById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(400).json();
  }
});

router.route("/getPublishingApproval/:id").get(async (req, res) => {
  const { id } = req.params;
  const data = await Competitions.findById(id);
  var approval = true;
  var msg;
  if (data.url === "") {
    approval = false;
    msg = "URL can't be empty";
    res.status(200).json({ msg: msg, approval: approval });
  }
  if (data.title === "") {
    approval = false;
    msg = "Title can't be empty";
    res.status(200).json({ msg: msg, approval: approval });
  }
  if (data.overview === "Enter competition overview here") {
    approval = false;
    msg = "Please edit Overview to give more information about this competition";
    res.status(200).json({ msg: msg, approval: approval });
  }
  if (data.evaluation === null) {
    approval = false;
    msg = "Please select an evaluation metric or create a custom evaluation metric";
    res.status(200).json({ msg: msg, approval: approval });
  }
  if (data.publicDataSetPath === null) {
    approval = false;
    msg = "Please upload Public Test Dataset";
    res.status(200).json({ msg: msg, approval: approval });
  }
  if (data.privateDataSetPath === null) {
    approval = false;
    msg = "Please upload Private Test Dataset";
    res.status(200).json({ msg: msg, approval: approval });
  }
  if (data.sandBoxSubmissionPath === null) {
    approval = false;
    msg = "Please upload a sandbox submission";
    res.status(200).json({ msg: msg, approval: approval });
  }
  if (data.sandBoxSubmissionLog !== null) {
    if (data.sandBoxSubmissionLog !== "") {
      approval = false;
      msg = "SandBox Submission should pass without errors";
      res.status(200).json({ msg: msg, approval: approval });
    }
  }
  else {
    approval = false;
    msg = "Please make a sandbox submission";
    res.status(200).json({ msg: msg, approval: approval });
  }
  msg = "All requirements satisfied";
  if (approval) {
    res.status(200).json({ msg: msg, approval: approval });
  }
});

router.route("/getSandBoxSubmissionStatus/:id").get(async (req, res) => {
  const { id } = req.params;
  const data = await Competitions.findById(id);
  if (data) {
    const sandBoxSubmissionStatus = data.sandBoxSubmissionStatus;
    res.status(200).json(sandBoxSubmissionStatus);
  } else {
    res.status(400).json();
  }
});


router.route("/getSandBoxStatus/:id").get(async (req, res) => {
  const { id } = req.params;
  const data = await Competitions.findById(id);
  if (data) {
    const sandBoxStatus = data.sandBoxStatus;
    res.status(200).json(sandBoxStatus);
  } else {
    res.status(400).json();
  }
});

router.route("/getPublicStatus/:id").get(async (req, res) => {
  const { id } = req.params;
  const data = await Competitions.findById(id);
  if (data) {
    const publicStatus = data.publicStatus;
    res.status(200).json(publicStatus);
  } else {
    res.status(400).json();
  }
});


router.route("/getPrivateStatus/:id").get(async (req, res) => {
  const { id } = req.params;
  const data = await Competitions.findById(id);
  if (data) {
    const privateStatus = data.privateStatus;
    res.status(200).json(privateStatus);
  } else {
    res.status(400).json();
  }
});

router.route("/isCompUrlExist/:url").get(async (req, res) => {
  const { url } = req.params;
  Competitions.findOne({ url: url }).then((data) => {
    return data
      ? res.status(404).send({ error: "Url Already Exist!" })
      : res.status(200).json();
  });
});

router.route("/addcompetitions").post(authenticate, async (req, res) => {
  const compete = new Competitions(req.body);
  compete
    .save()
    .then(async (competition) => {
      await Promise.all(
        competition.access.map(async (author) => {
          const team = await Team.findById(author);
          if (team) {
            team.competitionsAccess.push(compete._id);
            await team.save();
          }
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  res.status(201).json({ message: "Competition Created Successfully" });
});

router.route('/updateCompetetion/:id').put(authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateddata = await Competitions.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (updateddata.evaluation) {
      const task = celery.createTask("tasks.generateFile");
      task.applyAsync([updateddata.evaluation]);
    }

    console.log('Competition Updated!');
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Somthing went wrong!" });
  }
})

router.route('/publishCompetetion/:id').put(authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateddata = await Competitions.findById(id);
    updateddata.public = req.body.public;
    await updateddata.save();
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Somthing went wrong!" });
  }
})

router.route("/getCompeteNames").get(async (req, res) => {
  const data = await Competitions.find({ public: true });
  res.status(201).json(data);
});

router.route("/getDraftCompeteNames/:id").get(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findById(id);
  let competitions = [];
  if (team) {
    await Promise.all(
      team.competitionsAccess.map(async (competition_id) => {
        const c = await Competitions.findOne({
          _id: competition_id,
          public: false,
        });
        if (c) {
          competitions.push(c);
        }
      })
    );
    res.status(201).json(competitions);
  }
});

router.route("/isJoined/:competeid/:userid").get(async (req, res) => {
  const { competeid, userid } = req.params;
  try {
    let leaderboard = await Leaderboard.findOne({ compete: competeid, team: userid });
    return res.status(200).json(leaderboard ? true : false);
  }
  catch (err) {
    return res.status(400).json({ error: "Something went wrong!" })
  }
});

router.route("/joinCompete").post(async (req, res) => {
  try {
    if (req.body.password != req.body.cpassword) {
      return res.status(401).json({ error: "Passwords not matched!" });
    }
    const competeuser = new CompeteUser(req.body);
    await competeuser.save();
    const competition = await Competitions.findById(req.body.competition);
    competition.participantCount = competition.participantCount + 1;
    await competition.save()
    res.status(200).json({ message: "user registered Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Internal server error" });
  }
});

router.route("/joinCompeteAsUser/:competeid/:userid").put(async (req, res) => {
  const { competeid, userid } = req.params;
  let leaderboard = await Leaderboard.findOne({ compete: competeid, team: userid });
  if (!leaderboard) {
    leaderboard = new Leaderboard({
      compete: competeid,
      team: userid
    })
    await leaderboard.save();
    let compete = await Competitions.findById(competeid);
    compete.participantCount += 1;
    await compete.save();
  }
  res.status(200).json();
})


const { InitFileUpload } = require('../file_upload');
const fileUpload = InitFileUpload();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'EvaluationFiles')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.route("/submitCompeteFile").post(upload.single("competeFile"), async (req, res) => {
  const file = req.file.path;
  const name = req.file.filename;
  const mimeType = req.file.mimetype;
  const folder_id = Config.COMPETITION_DRIVE_FILE_ID;
  const key = await fileUpload.uploadFile({ name, file, mimeType, folder_id });
  const url = fileUpload.getUrl(key);
  const competition = await Competitions.findById(req.body.compete);
  const userSubmission = new UserSubmission({
    compete: req.body.compete,
    team: req.body.team,
    googleDrivePath: url,
    localFilePath: `submissions/${competition.title}/${name}`
  });
  await userSubmission.save();
  const lb = await Leaderboard.findOne({ compete: req.body.compete, team: req.body.team });
  lb.numSubmissions += 1;
  await lb.save();

  const task = celery.createTask("tasks.run_evaluation");
  task.applyAsync([userSubmission._id]);
  fs.unlink(file, (err) => {
    if (err) {
      console.error(err)
      return
    }
  });
  res.status(200).json();
})

router.route("/submitSandBoxFile").post(upload.single("sandBoxFile"), async (req, res) => {
  const file = req.file.path;
  const name = req.file.filename;
  const mimeType = req.file.mimetype;
  const folder_id = Config.COMPETITION_DRIVE_FILE_ID;
  const key = await fileUpload.uploadFile({ name, file, mimeType, folder_id });
  const url = fileUpload.getUrl(key);
  const competition = await Competitions.findById(req.body.compete);
  competition.sandBoxSubmissionUrl = url;
  competition.sandBoxSubmissionPath = `submissions/${competition.title}/${name}`;
  competition.sandBoxSubmissionStatus = true;
  await competition.save();

  const task = celery.createTask("tasks.run_sandBox_evaluation");
  task.applyAsync([competition._id]);
  fs.unlink(file, (err) => {
    if (err) {
      console.error(err)
      return
    }
  });
  res.status(200).json();
})



router.route("/getMySubmissions/:competeid/:userid").get(competeAuthenticate, async (req, res) => {
  try {
    const userSubmissions = await UserSubmission.find({ compete: req.params.competeid, team: req.params.userid }).sort({ createdAt: -1 });
    res.status(200).json(userSubmissions);
  } catch (err) {
    res.status(400).json();
  }
})

router.route("/editOverview/:id").put(authenticate, async (req, res) => {
  const { id } = req.params;
  const { overview } = req.body;
  let compete = await Competitions.findById(id);
  compete.overview = overview;
  await compete.save();
  res.status(200).json();
});

router.route("/deleteCompete/:id").post(async (req, res) => {
  const { id } = req.params;
  const compete = await Competitions.findById(id);
  if (compete) {
    const competeid = compete._id;
    await Leaderboard.deleteMany({ compete: competeid });
    await UserSubmission.deleteMany({ compete: competeid });
    await Competitions.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Competition Deleted Successfully!" });
  } else {
    return res.status(201).json({ message: "Competition Cannot be Deleted!" });
  }
});

module.exports = router;
