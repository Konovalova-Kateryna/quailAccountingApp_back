const express = require('express');
const logger = require('morgan');
const cors = require('cors');


require('dotenv').config();

const authRouter = require('./routes/api/auth');
const productsRouter = require('./routes/api/products');
const counterpartyRouter=require("./routes/api/counterparty");
const ordersRouter=require("./routes/api/order")
const expensesRouter=require("./routes/api/expenses")
const transactionsRouter=require("./routes/api/transaction")

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/counterparty', counterpartyRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/transactions', transactionsRouter);

app.use((req, res)=>{
    res.status(404).json({message: 'Route not found'});
}),

app.use((err, req, res, next) => {
  const status  = err.status ?? 500;
  const message = err.message ?? "Internal Server Error";
  res.status(status).json({ message });
});


module.exports = app;