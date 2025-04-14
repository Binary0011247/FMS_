const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/budget', authMiddleware, calculatorController.calculateBudget);

module.exports = router;
