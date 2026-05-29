const mongoose = require('mongoose');
const Calculation = require('../models/Calculation');
const fs = require('fs');
const path = require('path');
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

//ярлыки-бирки для маркировки и улучшения UI/UX ✅,❌,📊
// Экспорт данных в JSON
const exportToJSON = async () => {
    try {
// Получить расчеты
        const calculations = await Calculation.find({}).lean();

// Формирование даты для JSON
        const formattedCalculations = calculations.map(calc => ({
            ...calc,
            _id: calc._id.toString(),
            createdAt: calc.createdAt.toISOString(),
            updatedAt: calc.updatedAt.toISOString(),
        }));

// Создание директории
        const exportDir = path.join(__dirname, 'exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

// Сохранение файл.JSON 
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `calculations_export_${timestamp}.json`;
        const filepath = path.join(exportDir, filename);

        fs.writeFileSync(
            filepath,
            JSON.stringify(formattedCalculations, null, 2),
            'utf8'
        );

        console.log(` Data exported to: ${filepath}`);
        console.log(` Total records: ${calculations.length}`);

// Создает файл с разделением по типам
        const groupedData = {
            mortgage: calculations.filter(c => c.type === 'mortgage'),
            auto: calculations.filter(c => c.type === 'auto'),
            consumer: calculations.filter(c => c.type === 'consumer'),
            pension: calculations.filter(c => c.type === 'pension'),
        };

        Object.keys(groupedData).forEach(type => {
            const typeFilepath = path.join(exportDir, `${type}_calculations.json`);
            fs.writeFileSync(
                typeFilepath,
                JSON.stringify(groupedData[type], null, 2),
                'utf8'
            );
            console.log(`   ${type}: ${groupedData[type].length} records`);
        });

        process.exit(0);
    } catch (error) {
        console.error(' Error exporting data:', error);
        process.exit(1);
    }
};

// Запуск скрипта
const run = async () => {
    await connectDB();
    await exportToJSON();
};

run();