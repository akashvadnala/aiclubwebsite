const jwt = require("jsonwebtoken");
const CTeam = require('../model/CTeamSchema');

const competeAuthenticate = async (req,res,next) => {
    
    const token = req.cookies.cjwtoken;
    if(token){
        try{
            // const verifyToken = jwt.decode(token);
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            const rootUser = await CTeam.findOne({_id:verifyToken._id, "tokens:token":token});
            // console.log('rootUser',rootUser.username);
            if(!rootUser){ throw new Error("User not found")}
            req.token=token;
            req.rootUser=rootUser;
        }catch(err){
            res.status(401).send({msg:'No user found'});
        }
    }
    else{
        console.log('Do login');
    }
    next();
}

module.exports = competeAuthenticate