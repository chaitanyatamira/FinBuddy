const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/auth');
const XLSX = require('xlsx');

// Add new income
router.post('/', auth, async (req, res) => {
    try {
        const { title, amount, category, description } = req.body;

        const income = new Income({
            user: req.user._id,
            title,
            amount,
            category,
            description
        });

        await income.save();
        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: 'Error adding income' });
    }
});

// Get all income records
router.get('/', auth, async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user._id })
            .sort({ date: -1 });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income records' });
    }
});

// Delete income record
router.delete('/:id', auth, async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!income) {
            return res.status(404).json({ message: 'Income record not found' });
        }

        res.json({ message: 'Income record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting income record' });
    }
});

// Export income data to Excel
router.get('/export', auth, async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user._id })
            .sort({ date: -1 });

        // Prepare data for Excel
        const data = incomes.map(income => ({
            Title: income.title,
            Amount: income.amount,
            Category: income.category,
            Description: income.description,
            Date: income.date.toLocaleDateString()
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Income Data');

        // Generate Excel file
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=income_data.xlsx');

        // Send the file
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting income data' });
    }
});

module.exports = router; 