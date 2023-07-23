const jwt= require("jsonwebtoken");

require("dotenv").config();
const authenticate=(req,res,next)=>{
    const token=req.headers.authorization;
    try {
        if(token){
            const decoded= jwt.verify(token,process.env.key);
            const userID=decoded.userID
            // console.log(decoded);
            if(decoded){
                req.body.userID=userID
                next()
            }else{
                res.json("Please login First")
            }
        }else{
            res.json("Token not present.Please Login First")
        }
    } catch (error) {
        console.log(error.message)
        res.json({message:error.message})
    }
}

module.exports={
    authenticate
}