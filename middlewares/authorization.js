
const jwt=require("jsonwebtoken");

const authorise=(role_array)=>{
    return (req,res,next)=>{
        const userrole=req.body.userrole;
        if(role_array.includes(userrole)){
            next()
        }else{
            res.json("Not Authorized")
        }
    }
}

module.exports={
    authorise
}