const {Transaction}=require("../../schemas/transaction");

const getAll=async(__,res)=>{
    const filter={
        type:"order"
    }

    const orders=await Transaction.find(filter)
        .populate("owner", "name email")
        .populate("counterparty", "name phone")
        .sort({orderDate:-1});

    const total=orders.reduce((acc, order)=>acc+order.totalAmount, 0)

    res.json({orders, total})

}


module.exports=getAll;