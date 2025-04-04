import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboard } from '../config/api';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [last30DaysExpenses, setLast30DaysExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          summaryRes,
          transactionsRes,
          expenseCategoriesRes,
          incomeCategoriesRes,
          last30DaysExpensesRes,
        ] = await Promise.all([
          dashboard.getSummary(),
          dashboard.getRecentTransactions(),
          dashboard.getExpenseCategories(),
          dashboard.getIncomeCategories(),
          dashboard.getLast30DaysExpenses(),
        ]);

        setSummary(summaryRes.data);
        setRecentTransactions(transactionsRes.data);
        setExpenseCategories(expenseCategoriesRes.data);
        setIncomeCategories(incomeCategoriesRes.data);
        setLast30DaysExpenses(last30DaysExpensesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-green-50">
          <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
          <div className="text-3xl font-bold text-primary-600">
            ₹{summary.totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="card bg-red-50">
          <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
          <div className="text-3xl font-bold text-red-600">
            ₹{summary.totalExpense.toLocaleString()}
          </div>
        </div>
        <div className="card bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800">Balance</h3>
          <div className="text-3xl font-bold text-green-600">
            ₹{summary.balance.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
          <div className="h-64">
            <Pie
              data={{
                labels: expenseCategories.map((cat) => cat.category),
                datasets: [
                  {
                    data: expenseCategories.map((cat) => cat.amount),
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF',
                      '#FF9F40',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Income Categories</h2>
          <div className="h-64">
            <Pie
              data={{
                labels: incomeCategories.map((cat) => cat.category),
                datasets: [
                  {
                    data: incomeCategories.map((cat) => cat.amount),
                    backgroundColor: [
                      '#4CAF50',
                      '#2196F3',
                      '#FFC107',
                      '#9C27B0',
                      '#FF5722',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Last 30 Days Expenses</h2>
          <div className="h-64">
            <Line
              data={{
                labels: last30DaysExpenses.map((exp) => exp.date),
                datasets: [
                  {
                    label: 'Daily Expenses',
                    data: last30DaysExpenses.map((exp) => exp.amount),
                    borderColor: '#FF6384',
                    tension: 0.1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 