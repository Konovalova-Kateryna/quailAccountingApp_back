const express=require("express");
const ctrlWrapper=require("../../utils/ctrlWrapper");
const ctrl=require("../../controllers/products");
const {validateBody, isValidId}=require("../../middlewares");
const { schemas } = require("../../schemas/products");
const adminOnly=require("../../middlewares/adminOnly");
const auth=require("../../middlewares/auth");


const router=express.Router();

router.get("/", ctrlWrapper(ctrl.getAll));
router.get("/:id", isValidId, ctrlWrapper(ctrl.getById));

router.post("/", auth, adminOnly, validateBody(schemas.addSchema), ctrlWrapper(ctrl.add))

router.put("/:id", auth, adminOnly, isValidId, validateBody(schemas.addSchema), ctrlWrapper(ctrl.updateById));

router.delete("/:id", auth, adminOnly, isValidId, ctrlWrapper(ctrl.removeById));


module.exports=router;