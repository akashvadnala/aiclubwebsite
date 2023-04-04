const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: ""
        },
        code: {
            type: String
        }
    },
);

const Evaluations = mongoose.model("Evaluations", evaluationSchema);

module.exports = Evaluations;
