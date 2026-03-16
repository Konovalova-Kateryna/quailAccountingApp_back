const {Counterparty}=require("../../schemas/counterparty");

const getAll=async(__, res)=>{
    const result=await Counterparty.find({});
    res.json(result)
}

module.exports=getAll;