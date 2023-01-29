const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const teamSchema = new mongoose.Schema({
    projects:[{
        type: String,
    }],
    blogs:[{
        type: String,
    }],
    competitions:[{
        type: String
    }], 
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    profession: {
        type: String,
    },
    position:{
        type: String,
        default: "Member at AI Club NITC"
    },
    branch:{
        type:String
    },
    description: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isalumni: {
        type: Boolean,
        default: false
    },
    year: {
        type: Number,
    },
    phone:{
        type: Number,
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
    canCreateCompetitions:{
        type: Boolean,
        required: false
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
    if(this.isModified('password')){
        this.password = bcrypt.hash(this.password, 10);
        this.cpassword = this.password;
    }
    next();
});

teamSchema.methods.generateAuthToken = async function(){
    try{
        let token_d = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token_d });
        await this.save();
        return token_d;
    }catch(err){
        console.log(err);
    }
}

const Team = mongoose.model('Team',teamSchema);

module.exports = Team;