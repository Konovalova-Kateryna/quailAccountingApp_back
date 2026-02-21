const {Schema, model}=require("mongoose");
const {handleMongooseError}=require("../utils");
// const {Item}=require("./orderItem");
// const Joi=require("joi");

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


const transactionSchema=new Schema({
type:{
        type:String,
        enum:["order", "expense"],
        required:true,
    },
owner:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true,    
},

items:[itemSchema],

totalAmount:{
    type:Number,
    required:true
},
status:{
    type:String,
    enum:["new","processing","completed","canceled"],
    default:"new",
    
},
comment:{
    type:String
},
date:{
    type:Date,
    default:Date.now,
    required:true
    }
},{timestamps:true, versionKey:false});

transactionSchema.post("save", handleMongooseError);

// const addTransactionSchema=Joi.object({
//     userId:Joi.string().required(),
//     items:Joi.array().items(Joi.object({
//         productId:Joi.string().required(),
//         title:Joi.string().required(),
//         price:Joi.number().required(),
//         quantity:Joi.number().required(),
//         sum:Joi.number().required()
//     })).required(),
//     totalAmount:Joi.number().required(),
//     status:Joi.string().valid("new","completed","canceled").default("new")})

//     const updateStatusSchema=Joi.object({
//     status:Joi.string().valid("new","completed","canceled").required()  
//     })

// const schemas={
//     addOrderSchema,
//     updateStatusSchema
// }

const Transaction=model("transaction", transactionSchema);

module.exports={
    Transaction,
   
}