const {Schema, model}=require("mongoose");
const {handleMongooseError}=require("../utils");
const { type } = require("os");
// const {Item}=require("./orderItem");
// const Joi=require("joi");

const itemSchema=new Schema({
productId:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true
},
title:{
    type:String,
    
},
price:{
    type:Number,
    required:true,
    min:0
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
        required:[true, "Transaction type is required"],
    },
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,    
},
counterparty:{
    type:Schema.Types.ObjectId,
    ref:"Counterparty",
    default:null
},
orderDate:{
type:Date,
default:Date.now
},
shippingDate:{
    type:Date,
    default:Date.now
},

items:{
    type:[itemSchema],
    validate:{
        validator:(arr)=>arr.length>0,
    message:"Transaction must have at least one item"
    }
},

totalAmount:{
    type:Number,
    required:true,
    min:0
},

isPaid:{
    type:Boolean,
    default:false
},
isShipped:{
    type:Boolean,
    default:false
},

status:{
    type:String,
    enum:["new","processing","completed","canceled"],
    default:"new",
    
},
comment:{
    type:String,
    trim:true,
    default:""
},

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