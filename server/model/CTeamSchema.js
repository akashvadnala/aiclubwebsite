const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CTeamSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photo:{
        type: String
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});


CTeamSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hash(this.password, 10);
        this.cpassword = this.password;
    }
    next();
});

CTeamSchema.methods.generateAuthToken = async function(){
    try{
        let token_d = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token_d });
        await this.save();
        return token_d;
    }catch(err){
        console.log(err);
    }
}

const CTeam = mongoose.model('CTeam',CTeamSchema);

module.exports = CTeam;