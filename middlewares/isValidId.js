const {isValidObjectId}=require("mongoose");

const {HttpError}=require("../utils");

const isValidId=(req, _, next)=>{
    const {id}=req.params;
   
    if(!isValidObjectId(id)){
        const error=HttpError(400, `${id} is not valid id`)
        return next(error);}
    next();

};

module.exports=isValidId;