const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    expenseAmount: { type: Number, required: true },
    month: { type: String, required: true },  // New attribute for month
    expenseType: { type: String, required: true } 
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
