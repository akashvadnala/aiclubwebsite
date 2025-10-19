const jwt = require("jsonwebtoken");
const Team = require('../model/teamSchema');

const Authenticate = async (req, res, next) => {
    // support cookie or Authorization: Bearer <token>
    const token = (req.cookies && req.cookies.jwtoken) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: "Login to access this page" });

    try {
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        // correct path to token in array
        const rootUser = await Team.findOne({ _id: verifyToken._id, password: verifyToken.password, "tokens.token": token });
        if (!rootUser) {
            return res.status(401).json({ error: "User not found" });
        }
        req.token = token;
        req.rootUser = rootUser;
        next();
    } catch (err) {
        // handle malformed or expired tokens gracefully
        console.log('Authenticate error:', err && err.name ? err.name + ': ' + err.message : err);
        return res.status(401).json({ error: "Login to access this page" });
    }
};

module.exports = Authenticate;