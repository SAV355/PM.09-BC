const mongoose = require('mongoose');
const Calculation = require('../models/Calculation');
require('dotenv').config();

// Подключение к MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-calculator', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(' MongoDB connected successfully');
    } catch (error) {
        console.error(' MongoDB connection error:', error);
        process.exit(1);
    }
};

//ярлыки-бирки для маркировки, и улучшения визуала ✅,❌,📊🔧
// Создание индексов
const createIndexes = async () => {
    try {
        console.log(' Creating database indexes...');

        // Индекс для поиска по типу и дате
        await Calculation.collection.createIndex({ type: 1, createdAt: -1 });
        console.log('   ✓ Index: type + createdAt');

        // Индекс для поиска по email
        await Calculation.collection.createIndex({ userEmail: 1 });
        console.log('   ✓ Index: userEmail');

        // Индекс для поиска по дате создания
        await Calculation.collection.createIndex({ createdAt: -1 });
        console.log('   ✓ Index: createdAt');

        // Составной индекс для админской панели
        await Calculation.collection.createIndex({
            type: 1,
            createdAt: -1,
            monthlyPayment: 1
        });
        console.log('   ✓ Index: type + createdAt + monthlyPayment');

        // Индекс для поиска по типу кредита
        await Calculation.collection.createIndex({ loanType: 1 });
        console.log('   ✓ Index: loanType');

        console.log('\n All indexes created successfully');

        // Показываем существующие индексы
        const indexes = await Calculation.collection.getIndexes();
        console.log('\n Current indexes:');
        Object.keys(indexes).forEach(key => {
            console.log(`   ${key}:`, indexes[key].key);
        });

        process.exit(0);
    } catch (error) {
        console.error(' Error creating indexes:', error);
        process.exit(1);
    }
};

// Запуск скрипта
const run = async () => {
    await connectDB();
    await createIndexes();
};

run();