const {Transaction}=require("../../schemas/transaction");
const { HttpError } = require("../../utils");

const updateOrder=async(req,res,next)=>{
    const {id}=req.params;
    const {items}=req.body;

    const order=await Transaction.findByIdAndUpdate(id, req.body, {new:true})
    if(!order){
        throw HttpError(404, "Not found")
    }
    if(order.owner.toString()!==req.user._id.toString()){
        throw HttpError(403, "Not your order")
    }
    if(order.status!=="new"){
        throw HttpError(400, "Only new orders can be updated")
    }

    let totalAmount=0;
    const newItems=[];

    for (const item of items){
        const product=await Product.findById(item.productId);
        if(!product){
            throw HttpError(404, `Product with id ${item.productId} not found`);
        }
        const itemTotal=product.price*item.quantity;
        totalAmount+=itemTotal;

        newItems.push({
            productId: product._id,
            title:product.title,
            price: product.price,
            quantity: item.quantity,
            total: itemTotal
        })
    }
    order.items=newItems;
    order.totalAmount=totalAmount;

    await order.save();

    res.json(order)
}

module.exports=updateOrder;