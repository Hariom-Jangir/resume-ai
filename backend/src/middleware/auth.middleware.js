const jwt= require('jsonwebtoken');

function authUser(req,res,next) {
    const token = req.cookies.token ;
    if(!token){
        return res.status(401).json({message:'Unauthorized, no token provided'});
    }

    if(tokenBlacklistmodel.findOne({token})){
        return res.status(401).json({message:'Unauthorized, token is blacklisted'});
    }
    try{
const decoded= jwt.verify(token,process.env.JWT_SECRET);
req.userId = decoded.id;
next();
}
catch(err){
    return res.status(401).json({message:'Unauthorized, invalid token'});
}
}
module.exports = {authUser};