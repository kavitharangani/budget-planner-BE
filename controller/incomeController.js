const Income = require('../models/income'); // Adjust the import path as necessary

// Create a new income entry
const createIncome = async (req, res) => {
    const { month, incomes } = req.body; // Assuming the request body is an object with month and incomes array

    // Validate the request body
    if (!month || !incomes || !Array.isArray(incomes)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const newIncomes = []; // Array to hold the new incomes

        // Loop through each income data in the request
        for (const incomeData of incomes) {
            const { source, amount, investments } = incomeData;

            // Create a new Income instance
            const newIncome = new Income({
                user: req.userId,  // Assuming req.userId is set by the authenticate middleware
                month,
                source,
                amount,
                investments
            });

            // Save the income to the database
            const savedIncome = await newIncome.save();
            newIncomes.push(savedIncome);  // Add the saved income to the array
        }

        // Return the saved incomes as the response
        return res.status(201).json({
            message: 'Income entries created successfully',
            incomes: newIncomes
        });

    } catch (error) {
        // Return any errors that occurred during saving
        return res.status(500).json({
            message: 'Failed to add incomes',
            error: error.message
        });
    }
};

// Get all income entries
const getAllIncomes = async (req, res) => {
    try {
        const incomes = await Income.find(); // Fetch all income entries
        res.status(200).json({
            message: 'All income entries retrieved successfully',
            data: incomes
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving income entries',
            error: error.message
        });
    }
};

// Get the total amount of all income entries
const getTotalIncomeAmount = async (req, res) => {
    try {
        // Use MongoDB's aggregation framework to sum the 'amount' field
        const total = await Income.aggregate([
            {
                $group: {
                    _id: null, // No grouping by any field
                    totalAmount: { $sum: "$amount" } // Sum the 'amount' field
                }
            }
        ]);

        if (total.length > 0) {
            res.status(200).json({
                message: 'Total income amount retrieved successfully',
                totalAmount: total[0].totalAmount
            });
        } else {
            res.status(200).json({
                message: 'No income entries found',
                totalAmount: 0
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving total income amount',
            error: error.message
        });
    }
};

//get incomes by month
const getIncomesByMonth = async (req, res) => {
    const { month } = req.query;  // Get the month from query parameters

    if (!month) {
        return res.status(400).json({ message: 'Month parameter is required.' });
    }

    try {
        // Fetch incomes for the specified month (case-insensitive match)
        const incomes = await Income.find({
            month: { $regex: new RegExp(`^${month.trim()}$`, "i") } // Use regex for case-insensitive match
        });

        if (incomes.length === 0) {
            return res.status(404).json({ message: `No incomes found for the month: ${month}` });
        }

        // Return filtered incomes
        return res.status(200).json({ incomes });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({
            message: 'Failed to fetch incomes for the specified month',
            error: error.message
        });
    }
};




// Export all controller functions
module.exports = {
    createIncome,
    getAllIncomes,
    getTotalIncomeAmount,
    getIncomesByMonth
};
