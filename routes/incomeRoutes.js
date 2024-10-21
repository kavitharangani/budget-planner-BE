const express = require('express');
const router = express.Router();
const { createIncome,getAllIncomes,getTotalIncomeAmount,getIncomesByMonth } = require('../controller/incomeController');
const authenticate = require('../middleware/authenticate');

// Route to create an income entry
router.post('/income',authenticate, createIncome);
router.get('/',authenticate, getAllIncomes);
router.get('/total',authenticate, getTotalIncomeAmount);
router.get('/month', authenticate, getIncomesByMonth);
module.exports = router; 
