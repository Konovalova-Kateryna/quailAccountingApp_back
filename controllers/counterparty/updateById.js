const {Counterparty}=require("../../schemas/counterparty");
const { HttpError } = require("../../utils");

const updateById=async(req, res)=>{
    const {id}=req.params;
    const result=await Counterparty.findByIdAndUpdate(id, req.body, {new:true});
    if(!result){
        throw HttpError(404, "Not found")
    }
    res.json(result);

}

module.exports=updateById