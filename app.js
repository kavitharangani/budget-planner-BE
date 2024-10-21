const express = require('express');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200', // Angular's dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // if you are sending cookies
  }));
  
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/budget-planner', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection failed:', err);
});

// User and Expense routes
app.use('/api', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);


// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
