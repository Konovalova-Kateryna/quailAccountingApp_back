const {Transaction}=require("../../schemas/transaction");
const { HttpError } = require("../../utils");

const deleteOrder = async (req, res) => {
  const order = await Transaction.findOne({ _id: req.params.id, type: "order" });
  if (!order) throw HttpError(404, "Order not found");

  // Тільки власник або адмін може видалити
  const isOwner = order.owner.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw HttpError(403, "Forbidden");
// Можна видалити лише нове замовлення
  if (order.status!== "new") throw HttpError(400, `Cannot delete order with status "${order.status}"`);

  await order.deleteOne();
  res.json({ message: "Order deleted", id: req.params.id });
};

module.exports=deleteOrder;