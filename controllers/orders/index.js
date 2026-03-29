const addOrder=require("./add");
const getAllOrders=require("./getAll");
const getMyOrders=require("./getMy");
const updateStatus=require("./updateStatus");
const updateOrder=require("./updateById");
const deleteOrder=require("./deleteOrder");
const getOrderById=require("./getById");

module.exports={
    addOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrder,
    updateStatus,
    deleteOrder
}