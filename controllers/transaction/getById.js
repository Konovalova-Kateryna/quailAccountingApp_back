const {Transaction}=require("../../schemas/transaction");
const {HttpError}=require("../../utils")

const getById=async(req,res)=>{
   const order = await Transaction.findOne({
        _id:req.params.id,
        type:"order"
    })
    .populate("owner", "name")
    .populate("counterparty", "name phone");
    if(!order){
        throw HttpError(404, "Order not found")
    }
     // Перевірка прав: власник або admin
const isOwner = order.owner._id.toString() === req.user._id.toString();
const isAdmin = req.user.role === "admin";
if (!isOwner && !isAdmin) throw HttpError(403, "Access denied");

    res.json(order)
}

module.exports=getById