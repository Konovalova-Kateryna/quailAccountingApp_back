const {Schema, model}=require("mongoose");
const {handleMongooseError}=require("../utils");
const Joi=require("joi");

const userSchema=new Schema({    
    firebaseUid:{
        type:String,
        required:true,
        unique:true,
        index:true
    },    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

     
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
        
    },
    

},{timestamps:true});

userSchema.post("save", handleMongooseError);

const registerSchema=Joi.object({
    name:Joi.string().required(),
    email:Joi.string().required().email(),
    role:Joi.string().valid("user", "admin").default("user"),
    
});

const loginSchema=Joi.object({
    email:Joi.string().required(),
    password:Joi.string().required().min(6),
});

const schemas={
    registerSchema,
    loginSchema
};

const User=model("User", userSchema);

module.exports={
    User,
    schemas
};