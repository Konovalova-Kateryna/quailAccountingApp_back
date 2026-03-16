const {Counterparty}=require("../../schemas/counterparty");
const {HttpError}=require("../../utils")

const getById=async(req,res)=>{
    const {id}=req.params;
    const result=await Counterparty.findById(id);
    if(!result){
        throw HttpError(404, "Not found")
    }
    
    res.json(result)    
}

module.exports=getById