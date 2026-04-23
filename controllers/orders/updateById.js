const {Transaction}=require("../../schemas/transaction");
const { HttpError } = require("../../utils");
const {addOrderItems}=require("./add")

const updateOrder = async (req, res) => {
  // Спочатку знаходимо, потім перевіряємо права
  const order = await Transaction.findOne({ _id: req.params.id, type: "order" });
  if (!order) throw HttpError(404, "Order not found");

  // Власник або адмін може редагувати
  const isOwner = order.owner.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) throw HttpError(403, "Forbidden");

  // Заборона редагування завершених/скасованих замовлень
  if (["completed", "canceled"].includes(order.status)) {
    throw HttpError(400, `Cannot edit order with status "${order.status}"`);
  }

  const { items, shippingDate, isPaid, isShipped, status, comment } = req.body;

  // Якщо передали нові товари — перераховуємо
  if (items) {
    const { orderItems, totalAmount } = await addOrderItems(items);
    order.items       = orderItems;
    order.totalAmount = totalAmount;
  }

   // Статус замовлення може змінювати тільки адмін
  
    if (status       !== undefined){
        if(!isAdmin){throw HttpError(403, "Only admin can change status");}
     order.status       = status;
  }

  // Оновлюємо решту полів якщо передано
  if (shippingDate !== undefined) order.shippingDate = shippingDate;
  if (isPaid       !== undefined) order.isPaid       = isPaid;
  if (isShipped    !== undefined) order.isShipped    = isShipped;
  if (comment      !== undefined) order.comment      = comment;

  await order.save();
  await order.populate("counterparty", "name phone");

  res.json(order);
};

module.exports=updateOrder;