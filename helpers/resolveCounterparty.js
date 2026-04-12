    const { HttpError } = require("../../utils");
const {Product}=require("../../schemas/products");
const {Transaction}=require("../../schemas/transaction");
const {Counterparty}=require("../../schemas/counterparty");
    
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

module.exports=resolveCounterparty;