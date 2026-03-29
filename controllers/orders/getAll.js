const {Transaction}=require("../../schemas/transaction");


const getAllOrders=async(_,res)=>{

    const filter={
        type:"order"
    }

    const orders=await Transaction.find(filter)
        .populate("owner", "name email")
        .populate("counterparty", "name phone")
        .sort({orderDate:-1});

    const total=result.reduce((acc, order)=>acc+order.totalAmount, 0)

    res.json({orders, total})

}

module.exports=getAllOrders;