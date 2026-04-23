const {Transaction}=require("../../schemas/transaction");
const { HttpError } = require("../../utils");

const deleteTransaction=async(req,res,next)=>{
    const {id}=req.params

    const result=await Transaction.findByIdAndDelete(id)
    if(!result){
        throw HttpError(404, "Not found")
    }
    res.json({ message: "Transaction deleted", id: result.id })

}

module.exports=deleteTransaction;