const {Product}=require("../../schemas/products");

const getAll=async(__,res)=>{
    const result=await Product.find({}, "name price remnant");
    res.json(result)
}


module.exports=getAll;