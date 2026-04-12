const { HttpError } = require("../../utils");
const {Product}=require("../../schemas/products");

const addOrderItems=async(items)=>{
    const orderItems=[];
    let totalAmount=0;

    for (const item of items){
        const product = await Product.findById(item.productId);

        if (!product){
            throw HttpError(404, `Product "${product.title}" not found`)
        }
        if (!product.isActive){
            throw HttpError(400, `Product "${product.title}" is not active`)
        }

        const itemTotal=product.price * item.quantity;
        totalAmount+=itemTotal;

        orderItems.push({
            productId: product._id,
            title:product.title,
            price: product.price,
            quantity: item.quantity,
            total: itemTotal
        })
    }
    return {orderItems, totalAmount}
        }

        module.exports=addOrderItems;