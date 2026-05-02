const { HttpError } = require("../../utils");
const {Transaction}=require("../../schemas/transaction");
const resolveCounterparty = require("../../helpers/resolveCounterparty");
const addOrderItems = require("../../helpers/addOrderItems");

const addOrder=async(req, res)=>{
     const {
    items,
    counterpartyId,
    counterparty,
    shippingDate,
    comment,
  } = req.body;

    // Будуємо рядки товарів (ціна та назва беруться з БД)
  const { orderItems, totalAmount } = await addOrderItems(items);

  // Визначаємо контрагента (знайти або створити по телефону)
  const resolvedCounterpartyId = await resolveCounterparty({
    counterpartyId,
    counterparty,
  });   
    
    const data=await Transaction.create({
        type:req.body.type || "order",
        owner:req.user._id,
        counterparty: resolvedCounterpartyId,
        orderDate: new Date(),
        shippingDate: shippingDate?? null,
        items: orderItems,
        totalAmount: totalAmount,
        isPaid: false,
        isShipped: false,
        status: "new",
        comment:comment??null,
    })

    res.status(201).json(data)
}

module.exports=addOrder;