const { Transaction } = require("../../schemas/transaction");
const { HttpError } = require("../../utils");

const getOrderById=async(req, res)=>{
    const order = await Transaction.findOne({
        _id:req.params.id,
        type:"order"
    })
    .populate("owner", "name")
    .populate("counterparty", "name phone");
    if(!order){
        throw HttpError(404, "Order not found")
    }
    res.json(order)
}

module.exports=getOrderById