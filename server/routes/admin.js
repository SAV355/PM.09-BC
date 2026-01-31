const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');

// Middleware для проверки администратора (заглушка)
const isAdmin = (req, res, next) => {
    // В реальном приложении здесь была бы проверка JWT токена
    const adminToken = req.headers['x-admin-token'];

    if (adminToken === process.env.ADMIN_TOKEN || process.env.NODE_ENV === 'development') {
        next();
    } else {
        res.status(403).json({ error: 'Доступ запрещен' });
    }
};

router.use(isAdmin);

// Получение всех расчетов
router.get('/calculations', async (req, res) => {
    try {
        const { type, page = 1, limit = 20, startDate, endDate } = req.query;

        const query = {};

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const calculations = await Calculation.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await Calculation.countDocuments(query);

        res.json({
            success: true,
            data: calculations,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error('Admin calculations error:', error);
        res.status(500).json({ error: 'Ошибка при получении расчетов' });
    }
});

// Экспорт расчетов в CSV (заглушка)
router.get('/export', async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;

        const query = {};
        if (type) query.type = type;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const calculations = await Calculation.find(query)
            .sort({ createdAt: -1 })
            .select('-_id -__v -calculationTime -ipAddress -userAgent');

        // В реальном приложении здесь был бы генератор CSV
        res.json({
            success: true,
            message: 'Экспорт в CSV будет реализован в будущем',
            count: calculations.length,
            sample: calculations.slice(0, 3),
        });

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при экспорте' });
    }
});

// Статистика
router.get('/stats', async (req, res) => {
    try {
        const [totalCalculations, byType, dailyStats] = await Promise.all([
            Calculation.countDocuments(),
            Calculation.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]),
            Calculation.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 },
                        avgLoanAmount: { $avg: '$loanAmount' },
                    }
                },
                { $sort: { _id: -1 } },
                { $limit: 7 },
            ]),
        ]);

        res.json({
            success: true,
            data: {
                totalCalculations,
                byType: byType.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                dailyStats,
            },
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Ошибка при получении статистики' });
    }
});

module.exports = router;