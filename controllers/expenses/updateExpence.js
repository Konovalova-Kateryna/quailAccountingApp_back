const { HttpError } = require("../../utils");
const {Transaction}=require("../../schemas/transaction")

const updateExpense = async (req, res) => {
  const expense = await Transaction.findOne({ _id: req.params.id, type: "expense" });
  if (!expense) throw HttpError(404, "Expense not found");

  const { isPaid, isShipped, comment, status } = req.body;

  if (isPaid    !== undefined) expense.isPaid    = isPaid;
  if (isShipped !== undefined) expense.isShipped = isShipped;
  if (comment   !== undefined) expense.comment   = comment;
  if (status    !== undefined) expense.status    = status;

  await expense.save();
  res.json(expense);
};

module.exports=updateExpense;