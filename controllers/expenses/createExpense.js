const { HttpError } = require("../../utils");
const {Product}=require("../../schemas/products");
const {Transaction}=require("../../schemas/transaction")


const buildExpenseItems = async (items) => {
  const expenseItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw HttpError(404, `Product "${item.productId}" not found`);
    }

    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    expenseItems.push({
      productId: product._id,
      title:     product.title,
      price:     item.price,      // ціна закупки від адміна
      quantity:  item.quantity,
      total:     itemTotal,
    });
  }

  return { expenseItems, totalAmount };
};

const createExpense = async (req, res) => {
  const { items, shippingDate, isPaid, isShipped, comment } = req.body;

  const { expenseItems, totalAmount } = await buildExpenseItems(items);

  const expense = await Transaction.create({
    type:         "expense",
    owner:        req.user._id,
    orderDate:    new Date(),
    shippingDate: shippingDate ?? null,
    items:        expenseItems,
    totalAmount,
    isPaid:       isPaid   ?? false,
    isShipped:    isShipped ?? false,
    status:       "new",
    comment:      comment ?? null,
  });

  res.status(201).json(expense);
};

module.exports=createExpense;