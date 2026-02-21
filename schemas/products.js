const {Schema, model}=require("mongoose");
const {handleMongooseError}=require("../utils");

const Joi=require("joi");
const { type } = require("node:os");


const productSchema=new Schema({
    title:{
        type:String,
        required:[true, "Title is required"],
        unique:true
    },
    price:{
        type:Number,
        required:[true, "Price is required"]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    remnant:{
        type:Number,
    },
        quantity:{
        type:Number,
        
    },   

   },{timestamps:true, versionKey:false});

   productSchema.post("save", handleMongooseError);

const addSchema=Joi.object({
    title:Joi.string().required(),
    price:Joi.number().required(),
    isActive:Joi.boolean(),
    remnant:Joi.number(),
    quantity:Joi.number(),
});

const schemas={
    addSchema
}

const Product=model("product", productSchema);

module.exports={
    Product,
    schemas
}