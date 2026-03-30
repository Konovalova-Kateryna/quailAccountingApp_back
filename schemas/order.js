const {Schema, model}=require("mongoose");
const {handleMongooseError}=require("../utils");
const Joi=require("joi");


const itemSchema=new Schema({
productId:{
    type:Schema.Types.ObjectId,
    ref:"product",
    required:true
},
title:{
    type:String,
    
},
price:{
    type:Number,
    required:true
},
quantity:{
    type:Number,
    required:true,
    min:1
},
total:{
    type:Number,
    required:true
},
},{_id:false,timestamps:true, versionKey:false});

itemSchema.post("save", handleMongooseError);

const addItemSchema=Joi.object({
    productId:Joi.string().required(),
    title:Joi.string(),
    price:Joi.number().required(),
    quantity:Joi.number().required().min(1),
    total:Joi.number().required()
})

const schemas={
    addItemSchema
}

const Item=model("item", itemSchema);

module.exports={   
    Item,
    schemas
}

