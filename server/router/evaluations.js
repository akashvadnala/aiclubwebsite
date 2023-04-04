const express = require('express');
const router = express.Router();
const Evaluations = require('../model/EvaluationSchema');
const authenticate = require("../middleware/authenticate");

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