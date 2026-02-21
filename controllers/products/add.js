const {Product}=require("../../schemas/products");

const add=async(req,res)=>{
    
    const result=await Product.create(req.body)
    res.status(201).json(result)
}    

module.exports=add