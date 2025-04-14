// controllers/expenseController.js

exports.getAllExpenses = (req, res) => {
  // Example response
  res.json({ message: "All expenses fetched!" });
};

exports.addExpense = (req, res) => {
  res.json({ message: "Expense added!" });
};

exports.updateExpense = (req, res) => {
  res.json({ message: "Expense updated!" });
};

exports.deleteExpense = (req, res) => {
  res.json({ message: "Expense deleted!" });
};
