const jwt = require("jsonwebtoken");
const Team = require('../model/teamSchema');

const Authenticate = async (req,res,next) => {
    
    const token = req.cookies.jwtoken;
    if(!token) return res.status(401).json({error:"Login to access this page"});
    try{
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await Team.findOne({_id:verifyToken._id, password:verifyToken.password, "tokens:token":token});
        if(!rootUser){ 
            return res.status(401).json({error: "User not found"});
        }
        req.token=token;
        req.rootUser=rootUser;
        next();
    }catch(err){
        console.log('err',err);
        return res.status(401).json({error:"Login to access this page"});
    }
}

module.exports = Authenticate