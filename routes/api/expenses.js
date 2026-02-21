const express=require("express");
const router=express.Router();

const auth=require("../../middlewares/auth");
const adminOnly=require("../../middlewares/adminOnly");
const ctrlWrapper=require("../../utils/ctrlWrapper");
const ctrl=require("../../controllers/expenses")

router.post("/", auth, adminOnly, ctrlWrapper(ctrl.addExpense));

module.exports=router;