const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teamSchema = new mongoose.Schema({
  competitions: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  competitionsAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  }
});


const CompeteTeam = mongoose.model("CompeteTeam", teamSchema);

module.exports = CompeteTeam;
