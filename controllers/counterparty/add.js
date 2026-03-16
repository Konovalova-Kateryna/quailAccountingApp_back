const {Counterparty}=require("../../schemas/counterparty");

const add=async(req, res)=>{
    const result=await Counterparty.create(req.body)
    res.status(201).json(result)
}

module.exports=add