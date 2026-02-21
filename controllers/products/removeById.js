const {Product}=require("../../schemas/products");
const { HttpError } = require("../../utils");

const removeById=async(req, res)=>{
    const {id}=req.params

    const result=await Product.findByIdAndDelete(id);
    if(!result){
        throw HttpError(404, "Not found");
    }
    res.json(result);
}

module.exports=removeById;