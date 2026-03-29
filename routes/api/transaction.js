const express=require("express");
const router=express.Router();

const auth=require("../../middlewares/auth");
const ctrlWrapper=require("../../utils/ctrlWrapper");
const ctrl=require("../../controllers/transaction");
const adminOnly=require("../../middlewares/adminOnly");

router.post("/", auth, ctrlWrapper(ctrl.add));

router.get("/", auth, adminOnly, ctrlWrapper(ctrl.getAll));
router.get("/my", auth, ctrlWrapper(ctrl.getMy));

router.put("/:id", auth,ctrlWrapper(ctrl.updateById));
router.put("/:id", auth, adminOnly, ctrlWrapper(ctrl.updateStatus));

router.delete("/:id", auth, ctrlWrapper(ctrl.removeById) );

module.exports=router;