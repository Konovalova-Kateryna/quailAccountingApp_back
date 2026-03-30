// ─── Маршрути для Витрат ─────────────────────────────────────────────────────
// Всі маршрути витрат доступні тільки адміну
const { Router } = require("express");
const ctrl = require("../../controllers/expenses");
const { auth, adminOnly, isValidId, validateBody } = require("../../middlewares");
const { ctrlWrapper } = require("../../utils");
const schemas=require("../../schemas/transaction")

const router = Router();

// POST   /api/expenses       — створити витрату     (тільки admin)
// GET    /api/expenses       — всі витрати          (тільки admin)
// GET    /api/expenses/:id   — одна витрата         (тільки admin)
// PUT    /api/expenses/:id   — оновити витрату      (тільки admin)
// DELETE /api/expenses/:id   — видалити витрату     (тільки admin)

router.post("/",
  auth,
  adminOnly,
  validateBody(schemas.expenseSchemas.createExpenseSchema),
  ctrlWrapper(ctrl.createExpense)
);

router.get("/",
  auth,
  adminOnly,
  ctrlWrapper(ctrl.getAllExpenses)
);

router.get("/:id",
  auth,
  adminOnly,
  isValidId,
  ctrlWrapper(ctrl.getExpenseById)
);

router.put("/:id",
  auth,
  adminOnly,
  isValidId,
  validateBody(schemas.expenseSchemas.updateExpenseSchema),
  ctrlWrapper(ctrl.updateExpense)
);

router.delete("/:id",
  auth,
  adminOnly,
  isValidId,
  ctrlWrapper(ctrl.deleteExpense)
);

module.exports = router;
