const {Product}=require("../../schemas/products");
const {HttpError}=require("../../utils")

const getById=async(req,res)=>{
    const {id}=req.params;
    const result=await Product.findById(id, "name remnant");
    if(!result){
        throw HttpError(404, "Not found")
    }
    
    res.json(result)
}

module.exports=getById


// if(!result){
//         res.status(404).json({
//             status:"error",
//             code:404,
//             message:"Not found"
//         })