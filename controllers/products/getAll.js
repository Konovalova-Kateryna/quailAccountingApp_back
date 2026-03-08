const {Product}=require("../../schemas/products");

const getAll=async(__,res)=>{
    const result=await Product.find({});
    res.json(result)
}


module.exports=getAll;