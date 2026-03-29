// ─── Маршрути для Замовлень ───────────────────────────────────────────────────
const { Router } = require("express");
const ctrl = require("../../controllers/order");
const { auth, adminOnly, isValidId, validateBody } = require("../../middlewares");
const { createOrderSchema, updateOrderSchema } = require("../../validators/order.validator");
const { ctrlWrapper } = require("../../utils");

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
  validateBody(createOrderSchema),
  ctrlWrapper(ctrl.createOrder)
);

router.put("/:id",
  auth,
  isValidId,
  validateBody(updateOrderSchema),
  ctrlWrapper(ctrl.updateOrder)
);

router.delete("/:id",
  auth,
  isValidId,
  ctrlWrapper(ctrl.deleteOrder)
);

module.exports = router;
