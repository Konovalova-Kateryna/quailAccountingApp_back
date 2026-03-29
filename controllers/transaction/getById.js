const {Transaction}=require("../../schemas/transaction");
const {HttpError}=require("../../utils")

const getById=async(req,res)=>{
    const {id}=req.params;
    const result=await Transaction.findById(id);
    if(!result){
        throw HttpError(404, "Not found")
    }
    
    res.json(result)
}

module.exports=getById