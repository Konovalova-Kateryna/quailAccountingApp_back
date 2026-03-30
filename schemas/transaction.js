// ─── Модель Transaction (замовлення та витрати) ───────────────────────────────
const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../utils");
const Joi = require("joi");

// ─── Під-схема: окремий рядок товару в транзакції ─────────────────────────────
const transactionItemSchema = new Schema(
  {
    // Посилання на товар з БД
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "productId is required"],
    },
    // Назва фіксується на момент транзакції (щоб не змінювалась при редагуванні товару)
    title: {
      type: String,
      required: true,
    },
    // Ціна фіксується на момент транзакції
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    // Підсумок по рядку = price * quantity (розраховується на бекенді)
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false, versionKey: false }
);

// ─── Головна схема транзакції ─────────────────────────────────────────────────
const transactionSchema = new Schema(
  {
    // Тип: замовлення (продаж) або витрата (закупівля)
    type: {
      type: String,
      enum: ["order", "expense"],
      required: [true, "Transaction type is required"],
    },

    // Автор запису (користувач що створив)
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─── Поля для замовлення (type === "order") ────────────────────────────
    // Контрагент (клієнт) — може бути знайдений або створений по телефону
    counterparty: {
      type: Schema.Types.ObjectId,
      ref: "Counterparty",
      default: null,
    },

    // Дата замовлення — за замовчуванням поточна
    orderDate: {
      type: Date,
      default: Date.now,
    },

    // Дата відвантаження — задається вручну
    shippingDate: {
      type: Date,
      default: null,
    },

    // ─── Товари ────────────────────────────────────────────────────────────
    items: {
      type: [transactionItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Transaction must contain at least one item",
      },
    },

    // Загальна сума — розраховується автоматично на бекенді
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ─── Статусні прапорці ─────────────────────────────────────────────────
    isPaid: {
      type: Boolean,
      default: false,
    },
    isShipped: {
      type: Boolean,
      default: false,
    },

    // Статус (більш деталізований стан для замовлень)
    status: {
      type: String,
      enum: ["new", "processing", "completed", "canceled"],
      default: "new",
    },

    // Коментар
    comment: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

// ─── Індекс для швидкої вибірки за власником та типом ────────────────────────
transactionSchema.index({ owner: 1, type: 1 });
transactionSchema.index({ orderDate: -1 });

transactionSchema.post("save", handleMongooseError);
transactionSchema.post("findOneAndUpdate", handleMongooseError);

const Transaction=model("Transaction", transactionSchema);

// ─── Joi: схема одного рядка товару в замовленні ─────────────────────────────
// Клієнт передає тільки productId + quantity; решту бекенд бере з БД
const orderItemJoiSchema = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "any.required": "productId is required",
    "string.length": "productId must be a valid ObjectId (24 hex chars)",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "any.required": "quantity is required",
    "number.min":   "quantity must be at least 1",
  }),
});

// ─── Joi: схема одного рядка товару у витраті ────────────────────────────────
// При витраті адмін вказує ціну закупки вручну
const expenseItemJoiSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity:  Joi.number().integer().min(1).required(),
  price:     Joi.number().min(0).required().messages({
    "any.required": "price is required for expense item",
  }),
});

// ─── Joi: схеми для order ─────────────────────────────────────────────────────
const orderSchemas = {
  // Створення замовлення
  createOrderSchema: Joi.object({
    // Варіант 1: передати ID існуючого контрагента
    counterpartyId: Joi.string().hex().length(24).allow(null),
    // Варіант 2: передати дані для пошуку/створення по телефону
    counterparty: Joi.object({
      name:    Joi.string().trim().required(),
      phone:   Joi.string().trim().required(),
      address: Joi.string().trim().allow("", null),
    }),
    items: Joi.array().items(orderItemJoiSchema).min(1).required().messages({
      "any.required": "items are required",
      "array.min":    "Order must have at least one item",
    }),
    shippingDate: Joi.date().iso().allow(null),
    comment:      Joi.string().trim().allow("", null),
  }),

// Оновлення замовлення
  updateOrderSchema: Joi.object({
    items:        Joi.array().items(orderItemJoiSchema).min(1),
    shippingDate: Joi.date().iso().allow(null),
    isPaid:       Joi.boolean(),
    isShipped:    Joi.boolean(),
    status:       Joi.string().valid("new", "processing", "completed", "canceled"),
    comment:      Joi.string().trim().allow("", null),
  }).min(1),

  // Зміна статусу (admin PATCH /:id/status)
  updateStatusSchema: Joi.object({
    status: Joi.string().valid("new", "processing", "completed", "canceled").required(),
  }),
};

// ─── Joi: схеми для expense ───────────────────────────────────────────────────
const expenseSchemas = {
  createExpenseSchema: Joi.object({
    items: Joi.array().items(expenseItemJoiSchema).min(1).required().messages({
      "any.required": "items are required",
      "array.min":    "Expense must have at least one item",
    }),
    shippingDate: Joi.date().iso().allow(null),
    isPaid:       Joi.boolean().default(false),
    isShipped:    Joi.boolean().default(false),
    comment:      Joi.string().trim().allow("", null),
  }),

  updateExpenseSchema: Joi.object({
    isPaid:    Joi.boolean(),
    isShipped: Joi.boolean(),
    comment:   Joi.string().trim().allow("", null),
    status:    Joi.string().valid("new", "processing", "completed", "canceled"),
  }).min(1),
};

module.exports = {
  Transaction,
  transactionSchema,
  orderSchemas,
  expenseSchemas,
};