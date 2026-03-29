const {Transaction}=require("../../schemas/transaction");

const getAll=async(__,res)=>{
    const result=await Transaction.find({});
    res.json(result)
}


module.exports=getAll;