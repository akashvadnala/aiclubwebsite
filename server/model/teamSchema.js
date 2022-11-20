const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const teamSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    description: {
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
    year: {
        type: Number,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    isadmin:{
        type: Boolean,
        required: true
    },
    ismember:{
        type: Boolean,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
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


teamSchema.pre('save', async function(next){
    console.log("Hi from inside");
    if(this.isModified('password')){
        this.password = bcrypt.hash(this.password, 10);
        this.cpassword = this.password;
    }
    next();
});

teamSchema.methods.generateAuthToken = async function(){
    try{
        let token_d = jwt.sign({ _id: this._id }, process.env.SECRET_kEY);
        this.tokens = this.tokens.concat({ token: token_d });
        await this.save();
        return token_d;
    }catch(err){
        console.log(err);
    }
}

const Team = mongoose.model('Team',teamSchema);

module.exports = Team;