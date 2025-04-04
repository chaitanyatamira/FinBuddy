const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const XLSX = require('xlsx');

// Add new expense
router.post('/', auth, async (req, res) => {
    try {
        const { title, amount, category, description } = req.body;

        const expense = new Expense({
            user: req.user._id,
            title,
            amount,
            category,
            description
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error adding expense' });
    }
});

// Get all expense records
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id })
            .sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense records' });
    }
});

// Delete expense record
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense record not found' });
        }

        res.json({ message: 'Expense record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense record' });
    }
});

// Export expense data to Excel
router.get('/export', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id })
            .sort({ date: -1 });

        // Prepare data for Excel
        const data = expenses.map(expense => ({
            Title: expense.title,
            Amount: expense.amount,
            Category: expense.category,
            Description: expense.description,
            Date: expense.date.toLocaleDateString()
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expense Data');

        // Generate Excel file
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=expense_data.xlsx');

        // Send the file
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting expense data' });
    }
});

module.exports = router; 