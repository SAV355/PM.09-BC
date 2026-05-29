const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');
const CalculatorConfig = require('../models/CalculatorConfig');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

// --- Управление калькуляторами ---
// Все калькуляторы
router.get('/calculators', async (req, res) => {
    try {
        const calculators = await CalculatorConfig.find().sort('order');
        res.json(calculators);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получить калькулятор по ID
router.get('/calculators/:id', async (req, res) => {
    try {
        const calc = await CalculatorConfig.findById(req.params.id);
        if (!calc) return res.status(404).json({ error: 'Not found' });
        res.json(calc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Создать новый калькулятор
router.post('/calculators', async (req, res) => {
    try {
        const newCalc = new CalculatorConfig(req.body);
        await newCalc.save();
        res.status(201).json(newCalc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Обновить калькулятор
router.put('/calculators/:id', async (req, res) => {
    try {
        const updated = await CalculatorConfig.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удалить калькулятор
router.delete('/calculators/:id', async (req, res) => {
    try {
        const deleted = await CalculatorConfig.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Просмотр и экспорт результатов расчётов ---
router.get('/calculations', async (req, res) => {
    const { type, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const skip = (page - 1) * limit;
    try {
        const calculations = await Calculation.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await Calculation.countDocuments(query);
        res.json({
            data: calculations,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Экспорт в CSV
router.get('/export-csv', async (req, res) => {
    try {
        const calculations = await Calculation.find().sort({ createdAt: -1 }).lean();
        // Формирует CSV файл
        const fields = ['_id', 'type', 'loanAmount', 'monthlyPayment', 'totalPayment', 'overpayment', 'userEmail', 'createdAt'];
        const csvRows = [];
        csvRows.push(fields.join(','));
        for (const calc of calculations) {
            const row = fields.map(f => JSON.stringify(calc[f] || '')).join(',');
            csvRows.push(row);
        }
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=calculations.csv');
        res.send(csvRows.join('\n'));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Экспорт в JSON
router.get('/export-json', async (req, res) => {
    try {
        const calculations = await Calculation.find().sort({ createdAt: -1 }).lean();
        res.json(calculations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;