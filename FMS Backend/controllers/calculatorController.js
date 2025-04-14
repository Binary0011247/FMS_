// controllers/calculatorController.js

exports.calculateBudget = (req, res) => {
    const { income, expenses } = req.body;
  
    if (!income || !expenses) {
      return res.status(400).json({ message: "Income and expenses are required." });
    }
  
    const savings = income - expenses;
  
    res.json({
      income,
      expenses,
      savings,
      suggestion: savings > 0
        ? "Good job! You are saving money."
        : "You're spending more than you earn. Consider reducing your expenses.",
    });
  };
  