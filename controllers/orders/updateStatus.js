const {Transaction}=require("../../schemas/transaction");
const { HttpError } = require("../../utils");

const updateStatus=async(req,res)=>{
    const{id}=req.params
    const {status}=req.body;



const result =await Transaction.findById(id);
if(!result){
    throw HttpError(404, "Not found");

}

result.status=status;
await result.save();
res.json(result)
}

module.exports=updateStatus