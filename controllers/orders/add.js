const { HttpError } = require("../../utils");
const {Product}=require("../../schemas/products");
const {Transaction}=require("../../schemas/transaction")

const addOrder=async(req, res)=>{
    const {items}=req.body;

    if(!items||items.length===0){
        throw HttpError(400, "Order is empty")
    }

    const orderItems=[];
    let totalAmount=0;

    for (const item of items){
        const product=await Product.findById(item.productId);
        

        if(!product){
            throw HttpError(404, `Product with id ${item.productId} not found`);
        }

        const itemTotal=product.price*item.quantity;
        totalAmount+=itemTotal;

        orderItems.push({
            productId: product._id,
            title:product.title,
            price: product.price,
            quantity: item.quantity,
            total: itemTotal
        })
    }
    
    const order=await Transaction.create({
        type:"order",
        owner:req.user._id,
        items: orderItems,
        totalAmount: totalAmount 
    })

    res.status(201).json(order)
}

module.exports=addOrder;