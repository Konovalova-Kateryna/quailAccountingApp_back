const { HttpError } = require("../../utils");
const {Product}=require("../../schemas/products");
const {Transaction}=require("../../schemas/transaction")
const {Counterparty}=require("../../schemas/counterparty")


// Функція додавання товарів до транзакції

const addOrderItems=async(items)=>{
    const orderItems=[];
    let totalAmount=0;

    for (const item of items){
        const product = await Product.findById(item.productId);

        if (!product){
            throw HttpError(404, `Product "${item.title}" not found`)
        }
        if (!product.isActive){
            throw HttpError(400, `Product "${item.title}" is not active`)
        }

        const itemTotal=product.price * item.quantity;
        totalAmount+=itemTotal;

        orderItems.push({
            productId: product._id,
            title:product.title,
            price: product.price,
            quantity: item.quantity,
            total: itemTotal
        })
    }
    return {orderItems, totalAmount}
        }


        // Функція знайти або створити клієнта
/**
 * Логіка:
 *  1. Якщо передано counterpartyId — шукаємо в БД, повертаємо.
 *  2. Якщо передано counterparty.phone — шукаємо по телефону.
 *     - Знайшли → повертаємо існуючого.
 *     - Не знайшли → створюємо нового з переданими даними.
 *  3. Якщо нічого не передано → counterparty = null.
 */
const resolveCounterparty = async ({ counterpartyId, counterparty }) => {
  // Варіант 1: прямо передали ID
  if (counterpartyId) {
    const existing = await Counterparty.findById(counterpartyId);
    if (!existing) throw HttpError(404, "Counterparty not found");
    return existing._id;
  }

  // Варіант 2: передали об'єкт з телефоном
  if (counterparty?.phone) {
    // Пошук по телефону
    const found = await Counterparty.findOne({ phone: counterparty.phone });

    if (found) {
      // Клієнт вже є в БД — використовуємо його
      return found._id;
    }

    // Клієнта немає — створюємо нового
    const created = await Counterparty.create({
      name:    counterparty.name,
      phone:   counterparty.phone,
      address: counterparty.address ?? null,
    });
    return created._id;
  }

  // Варіант 3: контрагент не вказаний
  return null;
};



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
    
    const order=await Transaction.create({
        type:"order",
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

    res.status(201).json(order)
}

module.exports={addOrder, addOrderItems};