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
