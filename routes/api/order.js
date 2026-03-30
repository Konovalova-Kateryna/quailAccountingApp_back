// ─── Маршрути для Замовлень ───────────────────────────────────────────────────
const { Router } = require("express");
const ctrl = require("../../controllers/orders");
const { auth, adminOnly, isValidId, validateBody } = require("../../middlewares");
const { ctrlWrapper } = require("../../utils");
const schemas= require("../../schemas/transaction")

const router = Router();

// POST /api/orders           — створити замовлення (будь-який auth користувач)
// GET  /api/orders           — всі замовлення      (тільки admin)
// GET  /api/orders/my        — мої замовлення      (auth)
// GET  /api/orders/:id       — одне замовлення     (auth: власник або admin)
// PUT  /api/orders/:id       — оновити замовлення  (auth: власник або admin)
// DELETE /api/orders/:id     — видалити            (auth: власник або admin)


router.get("/my",  auth, ctrlWrapper(ctrl.getMyOrders));
router.get("/",    auth, adminOnly, ctrlWrapper(ctrl.getAllOrders));
router.get("/:id", auth, isValidId, ctrlWrapper(ctrl.getOrderById));

router.post("/",
  auth,
  validateBody(schemas.orderSchemas.createOrderSchema),
  ctrlWrapper(ctrl.addOrder)
);

router.put("/:id",
  auth,
  isValidId,
  validateBody(schemas.orderSchemas.updateOrderSchema),
  ctrlWrapper(ctrl.updateOrder)
);

router.delete("/:id",
  auth,
  isValidId,
  ctrlWrapper(ctrl.deleteOrder)
);

module.exports = router;
