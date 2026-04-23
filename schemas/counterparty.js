const {Schema, model}=require("mongoose");
const {handleMongooseError}=require("../utils");

const Joi=require("joi");

const counterpartySchema=new Schema({
    name:{
        type:String,
        required:[true, "Name is required"],
        unique:true
    },
    phone: {
        type: String,        
        unique: true
    },
  address: {
    type: String,
    
  }

   },{timestamps:true, versionKey:false});

   counterpartySchema.post("save", handleMongooseError);

const addSchema=Joi.object({
    name:Joi.string().required(),
    phone:Joi.string(),
    address:Joi.string()
});

const schemas={
    addSchema
}

const Counterparty=model("Counterparty", counterpartySchema);

module.exports={
    Counterparty,
    schemas
}