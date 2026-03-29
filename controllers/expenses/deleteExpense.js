const { HttpError } = require("../../utils");
const {Transaction}=require("../../schemas/transaction")

const deleteExpense = async (req, res) => {
  const expense = await Transaction.findOneAndDelete({
    _id:  req.params.id,
    type: "expense",
  });
  if (!expense) throw HttpError(404, "Expense not found");
  res.json({ message: "Expense deleted", id: req.params.id });
};

module.exports=deleteExpense;