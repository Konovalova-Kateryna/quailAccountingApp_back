const express=require("express");
const router=express.Router();

const auth=require("../../middlewares/auth");
const ctrlWrapper=require("../../utils/ctrlWrapper");
const ctrl=require("../../controllers/orders");
const adminOnly=require("../../middlewares/adminOnly");

router.post("/", auth, ctrlWrapper(ctrl.addOrder));

router.get("/", auth, adminOnly, ctrlWrapper(ctrl.getAllOrders));
router.get("/my", auth, ctrlWrapper(ctrl.getMyOrders));

router.put("/:id", auth,ctrlWrapper(ctrl.updateOrder));
router.put("/:id", auth, adminOnly, ctrlWrapper(ctrl.updateStatus));

router.delete("/:id", auth, ctrlWrapper(ctrl.deleteOrder) );

module.exports=router;
