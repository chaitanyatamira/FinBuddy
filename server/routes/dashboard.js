const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get dashboard summary
router.get('/summary', auth, async (req, res) => {
    try {
        const [incomes, expenses] = await Promise.all([
            Income.find({ user: req.user._id }),
            Expense.find({ user: req.user._id })
        ]);

        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const balance = totalIncome - totalExpense;

        res.json({
            totalIncome,
            totalExpense,
            balance
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary' });
    }
});

// Get recent transactions
router.get('/recent-transactions', auth, async (req, res) => {
    try {
        const [recentIncomes, recentExpenses] = await Promise.all([
            Income.find({ user: req.user._id })
                .sort({ date: -1 })
                .limit(5),
            Expense.find({ user: req.user._id })
                .sort({ date: -1 })
                .limit(5)
        ]);

        const transactions = [
            ...recentIncomes.map(income => ({
                type: 'income',
                ...income.toObject()
            })),
            ...recentExpenses.map(expense => ({
                type: 'expense',
                ...expense.toObject()
            }))
        ].sort((a, b) => b.date - a.date)
         .slice(0, 10);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent transactions' });
    }
});

// Get expense categories data for pie chart
router.get('/expense-categories', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });
        
        const categoryData = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const data = Object.entries(categoryData).map(([category, amount]) => ({
            category,
            amount
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense categories data' });
    }
});

// Get income categories data for pie chart
router.get('/income-categories', auth, async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user._id });
        
        const categoryData = incomes.reduce((acc, income) => {
            acc[income.category] = (acc[income.category] || 0) + income.amount;
            return acc;
        }, {});

        const data = Object.entries(categoryData).map(([category, amount]) => ({
            category,
            amount
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income categories data' });
    }
});

// Get last 30 days expenses for bar chart
router.get('/last-30-days-expenses', auth, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const expenses = await Expense.find({
            user: req.user._id,
            date: { $gte: thirtyDaysAgo }
        });

        const dailyExpenses = expenses.reduce((acc, expense) => {
            const date = expense.date.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + expense.amount;
            return acc;
        }, {});

        const data = Object.entries(dailyExpenses).map(([date, amount]) => ({
            date,
            amount
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching last 30 days expenses' });
    }
});

module.exports = router;