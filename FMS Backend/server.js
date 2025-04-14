const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // <--- This is the important line

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calculator', calculatorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
