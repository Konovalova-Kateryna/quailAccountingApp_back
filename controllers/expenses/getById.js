const { HttpError } = require("../../utils");
const {Transaction}=require("../../schemas/transaction")

const getExpenseById = async (req, res) => {
  const expense = await Transaction.findOne({
    _id:  req.params.id,
    type: "expense",
  }).populate("owner", "name email");

  if (!expense) throw HttpError(404, "Expense not found");
  res.json(expense);
};

module.exports=getExpenseById;