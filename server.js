const mongoose = require("mongoose");
const app=require("./app")

const {DB_HOST, PORT=3001}=process.env;

mongoose.set('strictQuery', true);

mongoose
.connect(DB_HOST)
.then(()=>{app.listen(PORT);
    console.log("Server running, base conected", PORT)
})
    .catch((error)=>{
    console.log(error.message);
    process.exit(1);
    });