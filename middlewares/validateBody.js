const {HttpError}=require("../utils");

const validateBody=(schema)=>{
    const func=(req,res,next)=>{
        const {error}=schema.validate(req.body);
        if(error){
             const message = error.details.map((d) => d.message).join("; ");
            return next(HttpError(400, message));

        }
        req.body=value;
        next()
    }
    return func;
}

module.exports=validateBody;