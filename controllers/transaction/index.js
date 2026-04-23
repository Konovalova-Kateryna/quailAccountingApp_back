const getAll=require("./getAll");
const getById=require("./getById");
const getMyTransactions=require("./getMy");
const add=require("./add");
const updateById=require("./updateById");
const removeById=require("./removeById");

module.exports={
    getAll,
    getById,
    getMyTransactions,
    add,
    updateById,
    removeById
}