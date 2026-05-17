const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const adminAuthRoutes = require('./routes/adminAuth');

//require('dotenv').config();  /* изменена для проверки, была « dotenv.config(); » */

const app = express();

// Middleware (промежуточный слой)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Ограничение скорости
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-calculator', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedCalculators = require('./db/seedCalculators');
seedCalculators().catch(console.error);

// Пути
app.use('/api/calculations', require('./routes/calculations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin-auth', adminAuthRoutes);

// Проверка здоровья
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Bank Calculator API'
    });
});

// 404 Обработчик
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error обработчика
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});