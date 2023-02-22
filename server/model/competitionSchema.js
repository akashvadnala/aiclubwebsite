const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      requied: true,
    },
    description:{
      type: String,
      default: "Enter competition description here"
    },
    dataset:{
      type: String,
      default: "Enter Dataset related information here Eg. Dataset Name, Kaggle Dataset Links, Google Drive Links etc.."
    },
    rules:{
      type: String,
      default: "Enter competition rules here"
    },
    evaluation:{
      type: String,
    },
    headerPhoto: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Team",
    },
    access: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    public: {
      type: Boolean,
    },
    participantCount: {
      type: Number,
      default: 0,
    },
    CompetitionStart: {
      type: Date,
    },
    CompetitionEnd: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Competitions = mongoose.model("Competitions", competitionSchema);

module.exports = Competitions;
