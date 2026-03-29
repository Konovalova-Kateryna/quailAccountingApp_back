// ─── Маршрути для Витрат ─────────────────────────────────────────────────────
// Всі маршрути витрат доступні тільки адміну
const { Router } = require("express");
const ctrl = require("../../controllers/expense");
const { auth, adminOnly, isValidId, validateBody } = require("../../middlewares");
const { createExpenseSchema, updateExpenseSchema } = require("../../validators/expense.validator");
const { ctrlWrapper } = require("../../utils");

const router = Router();

// POST   /api/expenses       — створити витрату     (тільки admin)
// GET    /api/expenses       — всі витрати          (тільки admin)
// GET    /api/expenses/:id   — одна витрата         (тільки admin)
// PUT    /api/expenses/:id   — оновити витрату      (тільки admin)
// DELETE /api/expenses/:id   — видалити витрату     (тільки admin)

router.post("/",
  auth,
  adminOnly,
  validateBody(createExpenseSchema),
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
  validateBody(updateExpenseSchema),
  ctrlWrapper(ctrl.updateExpense)
);

router.delete("/:id",
  auth,
  adminOnly,
  isValidId,
  ctrlWrapper(ctrl.deleteExpense)
);

module.exports = router;
