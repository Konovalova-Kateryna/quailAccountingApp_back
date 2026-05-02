const {Transaction}=require("../../schemas/transaction");

const getMyTransactions=async(req,res)=>{
    
   const data=await Transaction.find({owner:req.user._id, type:"order"})
    .populate("counterparty", "name phone")
    .sort({orderDate:-1});
    
    const total=data.reduce((acc, order)=>acc+order.totalAmount, 0)

    res.json({data, total})

}

module.exports=getMyTransactions;