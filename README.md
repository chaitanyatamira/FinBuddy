# FinBuddy - Personal Finance Management App

FinBuddy is a modern web application designed to help users manage their personal finances effectively. Built with React, Node.js, and MongoDB, it provides a comprehensive solution for tracking income, expenses, and financial goals.

![FinBuddy Screenshot](client/public/screenshot.png)

## Features

- 📊 **Dashboard Overview**

  - Real-time financial summary
  - Visual charts for income and expenses
  - Recent transactions tracking
  - Balance calculation

- 💰 **Income Management**

  - Add and track income sources
  - Categorize income
  - View income history
  - Export income data

- 💸 **Expense Tracking**

  - Record daily expenses
  - Categorize spending
  - Set budget limits
  - Export expense reports

- 🔐 **User Authentication**

  - Secure login and registration
  - JWT-based authentication
  - Profile management
  - Password protection

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Clean and intuitive UI
  - Dark mode support
  - Cross-platform compatibility

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Chart.js
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (for file uploads)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/finbuddy.git
cd finbuddy
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Start the development servers:

Backend:

```bash
cd server
npm start
```

Frontend:

```bash
cd client
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Documentation

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/user` - Get user profile

### Income

- POST `/api/income` - Add new income
- GET `/api/income` - Get all income records
- GET `/api/income/export` - Export income data

### Expenses

- POST `/api/expenses` - Add new expense
- GET `/api/expenses` - Get all expense records
- GET `/api/expenses/export` - Export expense data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Heroicons](https://heroicons.com/)
- Charts by [Chart.js](https://www.chartjs.org/)
- UI components by [Tailwind CSS](https://tailwindcss.com/)

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/finbuddy](https://github.com/yourusername/finbuddy)
