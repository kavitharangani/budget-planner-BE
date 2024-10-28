const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Link to user
    expenseAmount: { type: Number, required: true },
    month: { type: String, required: true },  // Month of the expense
    expenseType: { type: String, required: true } 
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
