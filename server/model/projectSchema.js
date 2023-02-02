const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Team"
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },
  ],

  isPublished: {
    type: Boolean,
    default: false,
  },
  researchPaperLink: {
    type: String,
  },
  publisher: {
    type: String,
  },
  coAuthors: [
    {
      type: String,
    },
  ],

  tags: [
    {
      type: String,
    },
  ],
  content: {
    type: String,
  },
  cover: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    default: false,
  },
  approvalStatus: {
    type: String,
    default: "submit",
  }
},{ timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
