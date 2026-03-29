const {Transaction}=require("../../schemas/transaction");

const getMyTransactions=async(req,res)=>{
    const orders=await Transaction.find({owner:req.user._id, type:"order"}).sort({date:-1});
    res.json(orders)

}

module.exports=getMyTransactions;