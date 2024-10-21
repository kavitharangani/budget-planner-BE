const express = require('express');
const router = express.Router();
const { addExpense,getExpenses,getTotalExpenses} = require('../controller/expenseController');
const authenticate = require('../middleware/authenticate'); // Import the middleware

// Define your routes with the authentication middleware
router.post('/add', authenticate, addExpense);
router.get('/', authenticate, getExpenses);
router.get('/total', authenticate, getTotalExpenses);
// router.get('/losses', authenticate, getTotalLosses);

module.exports = router;
