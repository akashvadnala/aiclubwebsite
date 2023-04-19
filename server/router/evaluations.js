const express = require('express');
const router = express.Router();
const Evaluations = require('../model/EvaluationSchema');
const authenticate = require("../middleware/authenticate");
const Competitions = require("../model/competitionSchema");
const multer = require('multer');
const celery = require("../celery");
const Config = require('../Config');
const fs = require('fs');

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

router.route("/uploadPrivateDataset/:competeid").put(authenticate, upload.single("privateDataSet"), async (req, res) => {
    console.log('file',req.file)
    const file = req.file.path;
    const name = req.file.filename;
    const mimeType = req.file.mimetype;
    const folder_id = Config.COMPETITION_DRIVE_FILE_ID;
    const key = await fileUpload.uploadFile({ name, file, mimeType, folder_id });
    const url = fileUpload.getUrl(key);
    let compete = await Competitions.findById(req.params.competeid);
    compete.privateDataSetUrl = url;
    compete.privateDataSetPath = `datasets/${compete.title}/${name}`;
    compete.privateStatus = true;
    await compete.save(); 
    const task = celery.createTask("tasks.privateDataSet");
    task.applyAsync([compete._id]);
    fs.unlink(file, (err) => {
      if (err) {
          console.error(err)
          return
      }
    });  
    res.status(200).json();
})

router.route("/uploadPublicDataset/:competeid").put(authenticate, upload.single("publicDataSet"), async (req, res) => {
    const file = req.file.path;
    const name = req.file.filename;
    const mimeType = req.file.mimetype;
    const folder_id = Config.COMPETITION_DRIVE_FILE_ID;
    const key = await fileUpload.uploadFile({ name, file, mimeType, folder_id });
    const url = fileUpload.getUrl(key);
    let compete = await Competitions.findById(req.params.competeid);
    compete.publicDataSetUrl = url;
    compete.publicDataSetPath = `datasets/${compete.title}/${name}`;
    compete.publicStatus = true;
    await compete.save(); 

    const task = celery.createTask("tasks.publicDataSet");
    task.applyAsync([compete._id]);
    fs.unlink(file, (err) => {
      if (err) {
          console.error(err)
          return
      }
    });  
    res.status(200).json();
})

router.route("/uploadSandBoxSubmission/:competeid").put(authenticate, upload.single("sandBoxSubmission"), async (req, res) => {
    const file = req.file.path;
    const name = req.file.filename;
    const mimeType = req.file.mimetype;
    const folder_id = Config.COMPETITION_DRIVE_FILE_ID;
    const key = await fileUpload.uploadFile({ name, file, mimeType, folder_id });
    const url = fileUpload.getUrl(key);
    let compete = await Competitions.findById(req.params.competeid);
    compete.sandBoxSubmissionUrl = url;
    compete.sandBoxSubmissionPath = `submissions/${compete.title}/${name}`;
    compete.sandBoxStatus = true;
    await compete.save();
    const task = celery.createTask("tasks.sandBoxSubmission");
    await task.applyAsync([compete._id]);
    fs.unlink(file, (err) => {
      if (err) {
          console.error(err)
          return
      }
    });  
    res.status(200).json();
})

router.route("/addEvaluationMetric").post(authenticate, async (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.status(400).json({ error: "Plz fill the field properly" });
    }
    try {
        const metric = req.body;
        const evaluation = new Evaluations(metric);
        await evaluation.save();
        res.status(201).json({ message: "Metric added Successful", id: evaluation._id });
    } catch (err) {
        console.log("err", err);
        res.status(500).json({ error: "Problem at server" });
    }
});

router.route("/updateEvaluationMetric/:id").put(authenticate, async (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.status(400).json({ error: "Plz fill the field properly" });
    }
    try {
        const updatedAbout = await Evaluations.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.status(200).json({ msg: "Evaluation Metric updated sucessfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "problem at server" });
    }
});

router.route('/getEvaluationMetrics').get(authenticate, async (req, res) => {
    const evaluations = await Evaluations.find({});
    res.status(200).json(evaluations);
});

router.route('/getEvaluationMetric/:id').get(authenticate, async (req, res) => {
    const evaluation = await Evaluations.findById(req.params.id);
    res.status(200).json(evaluation);
});

module.exports = router;