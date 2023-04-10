const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teamSchema = new mongoose.Schema({
  competitions: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  name: {
    type: String,
    required: true,
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
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

teamSchema.methods.generateAuthToken = async function () {
  try {
    let token_d = jwt.sign(
      { _id: this._id, password: this.password },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token_d });
    await this.save();
    return token_d;
  } catch (err) {
    console.log(err);
  }
};

const CompeteTeam = mongoose.model("CompeteTeam", teamSchema);

module.exports = CompeteTeam;
