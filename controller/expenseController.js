const mongoose = require("mongoose");
const Expense = require('../models/expense');

// Add a new expense
// exports.addExpense = async (req, res) => {
//     const { description, amount, month, expenseType} = req.body;

//     try {
//         const newExpense = new Expense({
//             user: req.userId,  // Assuming req.userId is set by authenticate middleware
//             description,
//             amount,
//             month,
//             expenseType
//         });
//         await newExpense.save();
//         return res.status(201).json({
//             message: 'Expense added successfully',
//             expense: newExpense
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Failed to add expense',
//             error: error.message
//         });
//     }
// };



// exports.addExpense = async (req, res) => {
//     const { month, expenses: expenseList } = req.body;

//     if (!month || !expenseList || !Array.isArray(expenseList)) {
//         return res.status(400).json({ error: 'Invalid data format' });
//     }

//     try {
//         // Prepare an array to hold the new expenses
//         const newExpenses = [];

//         // Loop through the list of expenses from the request body
//         for (const expenseData of expenseList) {
//             const { expenseAmount, expenseType } = expenseData;

//             // Create a new Expense instance
//             const newExpense = new Expense({
//                 // user: req.userId,  // Assuming req.userId is set by the authenticate middleware
//                 // description,
//                 expenseAmount,
//                 month,
//                 expenseType
//             });

//             // Save each expense to the database
//             await newExpense.save();
//             newExpenses.push(newExpense);  // Add each saved expense to the array of new expenses
//         }

//         // Return the saved expenses as the response
//         return res.status(201).json({
//             message: 'Expenses added successfully',
//             expenses: newExpenses
//         });

//     } catch (error) {
//         // Catch and return any errors
//         return res.status(500).json({
//             message: 'Failed to add expenses',
//             error: error.message
//         });
//     }
// };
exports.addExpense = async (req, res) => {
    const { month, expenses: expenseList } = req.body;

    if (!month || !expenseList || !Array.isArray(expenseList)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const newExpenses = []; // Array to hold the new expenses

        // Loop through each expense data in the request
        for (const expenseData of expenseList) {
            const { expenseAmount, expenseType } = expenseData;

            // Create a new Expense instance
            const newExpense = new Expense({
                user: req.userId,  // Assuming req.userId is set by the authenticate middleware
                expenseAmount,
                month,
                expenseType
            });

            // Save the expense to the database
            const savedExpense = await newExpense.save();
            newExpenses.push(savedExpense);  // Add the saved expense to the array
        }

        // Return the saved expenses as the response
        return res.status(201).json({
            message: 'Expenses added successfully',
            expenses: newExpenses
        });

    } catch (error) {
        // Return any errors that occurred during saving
        return res.status(500).json({
            message: 'Failed to add expenses',
            error: error.message
        });
    }
};




// exports.addExpense = async (req, res) => {
//     const expenses = req.body; // Expecting an array of expense objects

//     if (!Array.isArray(expenses) || expenses.length === 0) {
//         return res.status(400).json({
//             message: 'Invalid input, expected an array of expenses.'
//         });
//     }

//     try {
//         // Prepare an array to hold the new expenses
//         const newExpenses = [];

//         for (const expenseData of expenses) {
//             const { description, amount, month, expenseType } = expenseData;

//             // Create a new Expense instance
//             const newExpense = new Expense({
//                 user: req.userId, // Assuming req.userId is set by authenticate middleware
//                 description,
//                 amount,
//                 month,
//                 expenseType
//             });

//             // Save the expense to the database
//             await newExpense.save();
//             newExpenses.push(newExpense); // Add to the array of new expenses
//         }

//         return res.status(201).json({
//             message: 'Expenses added successfully',
//             expenses: newExpenses
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Failed to add expenses',
//             error: error.message
//         });
//     }
// };



// Get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.userId });
        return res.status(200).json({ expenses });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch expenses',
            error: error.message
        });
    }
};

// Get the total expenses for a user
// exports.getTotalExpenses = async (req, res) => {
//     try {
//         const total = await Expense.aggregate([
//             { $match: { user: mongoose.Types.ObjectId(req.userId) } },
//             { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//         ]);

//         const totalAmount = total.length ? total[0].totalAmount : 0;
//         return res.status(200).json({ total: totalAmount });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Failed to calculate total expenses',
//             error: error.message
//         });
//     }
// };
exports.getTotalExpenses = async (req, res) => {
    try {
        // Fetch all expenses for the user
        const expenses = await Expense.find({ user: req.userId });

        // Calculate the total amount from the fetched expenses
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        return res.status(200).json({ 
            expenses,
            totalAmount 
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch expenses',
            error: error.message
        });
    }
};





// // Get the total losses (negative expenses) for a user
// exports.getTotalLosses = async (req, res) => {
//     try {
//         const total = await Expense.aggregate([
//             { $match: { user: mongoose.Types.ObjectId(req.userId), amount: { $lt: 0 } } },
//             { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//         ]);

//         const totalAmount = total.length ? total[0].totalAmount : 0;
//         return res.status(200).json({ total: totalAmount });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Failed to calculate total losses',
//             error: error.message
//         });
//     }
// };
