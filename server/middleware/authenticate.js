const jwt = require("jsonwebtoken");
const Team = require('../model/teamSchema');

const Authenticate = async (req,res,next) => {
    
    const token = req.cookies.jwtoken;
    if(token){
        try{
            // const verifyToken = jwt.decode(token);
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            const rootUser = await Team.findOne({_id:verifyToken._id, password:verifyToken.password, "tokens:token":token});
            // console.log('rootUser',rootUser.username);
            if(!rootUser){ throw new Error("User not found")}
            req.token=token;
            req.rootUser=rootUser;
        }catch(err){
            res.status(401).send({msg:'No user found'});
        }
    }
    next();
}

module.exports = Authenticate