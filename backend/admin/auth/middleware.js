const jwt=require('jsonwebtoken');
const Admin = require('./Admin');

const verifyToken = async (req, res, next) => {
    const token=req.headers['authorization'];
    if(!token){
        return res.status(401).json({message:'No token provided'});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.admin=decoded;
        next();
    }catch(err){
        return res.status(403).json({message:'Invalid token'});
    }
}
module.exports = {
  verifyToken,
}