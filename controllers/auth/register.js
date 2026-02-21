// const {Conflict}=require("http-errors")

// const {User}=require("../../schemas")

// const register=async(req,res)=>{
//     const {name, login, password}=req.body;
//     const user=await User.findOne({login})
//     if(user){
//         throw new Conflict(`User ${login} in use`)        
//     }
//     const result=await User.create({name, login, password})
// res.status(201).json({
//     status:"success",
//     code:201,
//     data:{
//         user:{
//             name, login}
//         }
// })}

// module.exports=register;