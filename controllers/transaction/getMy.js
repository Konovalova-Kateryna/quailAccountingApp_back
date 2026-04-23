const {Transaction}=require("../../schemas/transaction");

const getMyTransactions=async(req,res)=>{
    
   const orders=await Transaction.find({owner:req.user._id, type:"order"})
    .populate("counterparty", "name phone")
    .sort({orderDate:-1});
    
    res.json(orders)

}

module.exports=getMyTransactions;