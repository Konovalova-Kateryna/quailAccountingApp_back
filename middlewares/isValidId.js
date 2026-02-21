const {isValidObjectId}=require("mongoose");

const {HttpError}=require("../utils");

const isValidId=(req, _, next)=>{
    const {id}=req.params;
    const isCorrectId=isValidObjectId(id);

    if(!isCorrectId){
        const error=HttpError(400, `${id} is not valid id`)
        next(error);}
    next();

};

module.exports=isValidId;