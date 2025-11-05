import jwt  from "jsonwebtoken";

export const verifytoken=(req,res,next)=>{
    try {
        console.log(req.cookies)
        const token=req.cookies.jwt
        console.log({token})
        
        if(!token){
            return res.status(401).json({message:"Cookie Issue"})            
        }
        jwt.verify(token,process.env.JS_KEY,(err,decoded)=>{
            if(err){
                return res.status(403).json({message:"Invalid Token"})
            }
            req.id=decoded.id
            // req.email=decoded.email
            next()
        })
    }
    catch(error){
        console.log(error)
    }

}
