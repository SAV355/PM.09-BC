const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');

// Формулы расчета (аналогичные фронтенду)
const calculateMortgage = (propertyCost, initialPayment, annualRate, termYears) => {
    const loanAmount = propertyCost - initialPayment;
    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = termYears * 12;
    const totalRate = Math.pow(1 + monthlyRate, totalPayments);
    const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
    const totalPayment = monthlyPayment * totalPayments;
    const overpayment = totalPayment - loanAmount;
    const requiredIncome = monthlyPayment * 2.5;

    return {
        loanAmount,
        monthlyRate,
        totalRate,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        overpayment: Math.round(overpayment),
        requiredIncome: Math.round(requiredIncome),
    };
};

// Расчет ипотеки
router.post('/mortgage', async (req, res) => {
    try {
        const startTime = Date.now();

        const { propertyCost, initialPayment, termYears, email } = req.body;

        // Валидация
        if (!propertyCost || propertyCost <= 0) {
            return res.status(400).json({ error: 'Некорректная стоимость недвижимости' });
        }

        if (!initialPayment || initialPayment < 0) {
            return res.status(400).json({ error: 'Некорректный первоначальный взнос' });
        }

        if (!termYears || termYears < 1 || termYears > 50) {
            return res.status(400).json({ error: 'Некорректный срок кредита' });
        }

        const loanAmount = propertyCost - initialPayment;
        if (loanAmount <= 0) {
            return res.status(400).json({ error: 'Сумма кредита должна быть больше 0' });
        }

        // Расчет
        const annualRate = 9.6; // Из ТЗ
        const results = calculateMortgage(propertyCost, initialPayment, annualRate, termYears);
        const calculationTime = Date.now() - startTime;

        // Сохранение в базу данных
        const calculation = new Calculation({
            type: 'mortgage',
            propertyCost,
            initialPayment,
            loanAmount,
            annualRate,
            termYears,
            ...results,
            userEmail: email,
            calculationTime,
            calculationMethod: 'standard',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        });

        await calculation.save();

        res.json({
            success: true,
            data: results,
            calculationId: calculation._id,
            calculationTime,
        });

    } catch (error) {
        console.error('Mortgage calculation error:', error);
        res.status(500).json({ error: 'Ошибка при расчете ипотеки' });
    }
});

// Сохранение расчета
router.post('/save', async (req, res) => {
    try {
        const calculation = new Calculation(req.body);
        await calculation.save();
        res.json({ success: true, id: calculation._id });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при сохранении расчета' });
    }
});

// Отправка результатов на email (заглушка)
router.post('/send-email', async (req, res) => {
    try {
        const { email, calculationId, results } = req.body;

        // Здесь будет реализация отправки email через nodemailer
        // const info = await transporter.sendMail({
        //   from: process.env.EMAIL_FROM,
        //   to: email,
        //   subject: 'Результаты расчета ипотеки',
        //   html: generateEmailTemplate(results),
        // });

        res.json({
            success: true,
            message: 'Email будет отправлен в ближайшее время',
            // messageId: info.messageId,
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Ошибка при отправке email' });
    }
});

// Получение истории расчетов по email
router.get('/history/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const calculations = await Calculation.find({ userEmail: email })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-__v -ipAddress -userAgent');

        res.json({ success: true, data: calculations });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении истории' });
    }
});

module.exports = router;