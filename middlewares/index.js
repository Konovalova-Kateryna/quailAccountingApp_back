const isValidId=require("./isValidId");
const validateBody=require("./validateBody");
const auth=require('./auth');
const adminOnly=require("./adminOnly");

module.exports={
    isValidId, validateBody, auth, adminOnly
}