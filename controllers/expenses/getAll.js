const {Transaction}=require("../../schemas/transaction")

const getAllExpenses = async (_req, res) => {
  const expenses = await Transaction.find({ type: "expense" })
    .populate("owner", "name email")
    .sort({ orderDate: -1 });

  const totalSpent = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  res.json({ expenses, totalSpent });
};

module.exports=getAllExpenses;