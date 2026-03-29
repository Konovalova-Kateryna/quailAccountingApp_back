const {Transaction}=require("../../schemas/transaction");
const {HttpError}=require("../../utils");

const add=async(req, res)=>{
    const result=await Transaction.create(req.body)
    res.status(201).json(result)
}

module.exports=add;