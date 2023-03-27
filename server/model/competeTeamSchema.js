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
  },
  canChangePassword: {
    type: Boolean,
    default: false,
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

teamSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
    this.cpassword = this.password;
  }
  next();
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

teamSchema.methods.generateForgetPasswordToken = async function () {
  try {
    let token_d = jwt.sign(
      { _id: this._id, email: this.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "5m",
      }
    );
    return token_d;
  } catch (err) {
    console.log(err);
  }
};

const CompeteTeam = mongoose.model("CompeteTeam", teamSchema);

module.exports = CompeteTeam;
