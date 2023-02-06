const jwt = require("jsonwebtoken");
const Team = require('../model/teamSchema');

const Authenticate = async (req,res,next) => {
    
    const token = req.cookies.jwtoken;
    console.log("token :",token);
    if(!token) return res.status(401).json({msg:"Login to access this page"});
    try{
        // const verifyToken = jwt.decode(token);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log("verigyToken: ",verifyToken);
        const rootUser = await Team.findOne({_id:verifyToken._id, password:verifyToken.password, "tokens:token":token});
        // console.log('rootUser',rootUser.username);
        if(!rootUser){ throw new Error("User not found")}
        req.token=token;
        req.rootUser=rootUser;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({msg:"Login to access this page"});
    }
}

module.exports = Authenticate