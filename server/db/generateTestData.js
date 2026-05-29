const mongoose = require('mongoose');
const Calculation = require('../models/Calculation');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// Настройка языка для faker
faker.locale = 'ru';

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

// Генератор случайных ипотечных расчетов
const generateMortgageCalculation = () => {
    const propertyCost = faker.datatype.number({ min: 2000000, max: 20000000, precision: 100000 });
    const initialPayment = faker.datatype.number({ min: propertyCost * 0.1, max: propertyCost * 0.5, precision: 100000 });
    const loanAmount = propertyCost - initialPayment;
    const termYears = faker.helpers.arrayElement([5, 10, 15, 20, 25, 30]);
    const annualRate = faker.helpers.arrayElement([9.6, 10.1, 9.9, 10.5]);

    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = termYears * 12;
    const totalRate = Math.pow(1 + monthlyRate, totalPayments);
    const monthlyPayment = Math.round(loanAmount * monthlyRate * totalRate / (totalRate - 1));
    const totalPayment = monthlyPayment * totalPayments;
    const overpayment = totalPayment - loanAmount;
    const requiredIncome = monthlyPayment * 2.5;

    return {
        type: 'mortgage',
        propertyCost,
        initialPayment,
        loanAmount,
        annualRate,
        termYears,
        monthlyPayment,
        totalPayment,
        overpayment,
        requiredIncome,
        monthlyRate,
        totalRate,
        userEmail: faker.internet.email(),
        propertyType: faker.helpers.arrayElement(['primary', 'secondary', 'commercial']),
        loanType: faker.helpers.arrayElement(['standard', 'express', 'family']),
        calculationMethod: 'standard',
        createdAt: faker.date.between('2023-01-01', '2024-02-01'),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
    };
};

// Генератор случайных автокредитов
const generateAutoCalculation = () => {
    const carCost = faker.datatype.number({ min: 500000, max: 5000000, precision: 50000 });
    const initialPayment = faker.datatype.number({ min: carCost * 0.1, max: carCost * 0.5, precision: 50000 });
    const loanAmount = carCost - initialPayment;
    const termYears = faker.helpers.arrayElement([1, 2, 3, 5, 7]);
    const annualRate = faker.helpers.arrayElement([3.5, 4.0, 4.5, 5.0, 5.5]);

    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = termYears * 12;
    const totalRate = Math.pow(1 + monthlyRate, totalPayments);
    const monthlyPayment = Math.round(loanAmount * monthlyRate * totalRate / (totalRate - 1));
    const totalPayment = monthlyPayment * totalPayments;
    const overpayment = totalPayment - loanAmount;
    const insurance = Math.round(carCost * 0.005 / 12);
    const totalMonthlyPayment = monthlyPayment + insurance;
    const requiredIncome = totalMonthlyPayment * 2;

    return {
        type: 'auto',
        propertyCost: carCost,
        initialPayment,
        loanAmount,
        annualRate,
        termYears,
        monthlyPayment,
        totalPayment,
        overpayment,
        requiredIncome,
        monthlyRate,
        totalRate,
        insurance,
        totalMonthlyPayment,
        userEmail: faker.internet.email(),
        carType: faker.helpers.arrayElement(['new', 'used', 'premium']),
        loanType: faker.helpers.arrayElement(['standard', 'express', 'family']),
        calculationMethod: 'standard',
        createdAt: faker.date.between('2023-01-01', '2024-02-01'),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
    };
};

// Генератор случайных потребительских кредитов
const generateConsumerCalculation = () => {
    const loanAmount = faker.datatype.number({ min: 50000, max: 3000000, precision: 10000 });
    const termYears = faker.helpers.arrayElement([1, 2, 3, 5]);
    const annualRate = faker.helpers.arrayElement([14.5, 15.0, 16.0, 17.5]);

    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = termYears * 12;
    const totalRate = Math.pow(1 + monthlyRate, totalPayments);
    const monthlyPayment = Math.round(loanAmount * monthlyRate * totalRate / (totalRate - 1));
    const totalPayment = monthlyPayment * totalPayments;
    const overpayment = totalPayment - loanAmount;
    const requiredIncome = monthlyPayment * 2;

    return {
        type: 'consumer',
        propertyCost: loanAmount,
        initialPayment: 0,
        loanAmount,
        annualRate,
        termYears,
        monthlyPayment,
        totalPayment,
        overpayment,
        requiredIncome,
        monthlyRate,
        totalRate,
        userEmail: faker.internet.email(),
        loanPurpose: faker.helpers.arrayElement(['consumer', 'education', 'medical', 'business', 'travel']),
        loanType: faker.helpers.arrayElement(['standard', 'express', 'secured']),
        calculationMethod: 'standard',
        createdAt: faker.date.between('2023-01-01', '2024-02-01'),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
    };
};

// Генератор случайных пенсионных расчетов
const generatePensionCalculation = () => {
    const currentAge = faker.datatype.number({ min: 25, max: 60 });
    const retirementAge = faker.datatype.number({ min: currentAge + 5, max: 70 });
    const currentSavings = faker.datatype.number({ min: 0, max: 5000000, precision: 100000 });
    const monthlyContribution = faker.datatype.number({ min: 5000, max: 100000, precision: 5000 });
    const expectedReturn = faker.datatype.number({ min: 3, max: 12, precision: 0.5 });

    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = expectedReturn / 12 / 100;

    let futureValue = currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
    let futureContributions = 0;

    for (let i = 0; i < monthsToRetirement; i++) {
        futureContributions += monthlyContribution * Math.pow(1 + monthlyReturn, monthsToRetirement - i);
    }

    const totalAtRetirement = futureValue + futureContributions;
    const withdrawalRate = faker.helpers.arrayElement([0.03, 0.04, 0.05]);
    const privatePension = totalAtRetirement * withdrawalRate;
    const statePension = faker.datatype.number({ min: 12000, max: 30000 }) * 12;
    const totalAnnualPension = statePension + privatePension;
    const monthlyPension = totalAnnualPension / 12;

    return {
        type: 'pension',
        currentAge,
        retirementAge,
        currentSavings,
        monthlyContribution,
        expectedReturn,
        inflationRate: faker.datatype.number({ min: 2, max: 8, precision: 0.5 }),
        totalAtRetirement: Math.round(totalAtRetirement),
        monthlyPension: Math.round(monthlyPension),
        totalAnnualPension: Math.round(totalAnnualPension),
        statePension: Math.round(statePension),
        privatePension: Math.round(privatePension),
        userEmail: faker.internet.email(),
        pensionType: faker.helpers.arrayElement(['state', 'private', 'mixed']),
        investmentType: faker.helpers.arrayElement(['conservative', 'moderate', 'aggressive']),
        calculationMethod: 'standard',
        createdAt: faker.date.between('2023-01-01', '2024-02-01'),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
    };
};

// Ярлыки-бирки для маркировки и улучшения UI/UX🗑️🎲✅📊📋❌
// Основная функция генерации тестовых данных
const generateTestData = async () => {
    try {
        // Очищаем существующие данные
        await Calculation.deleteMany({});
        console.log('  Existing data cleared');

        const totalRecords = 150; // 150 записей
        const allCalculations = [];

        console.log(`\n Generating ${totalRecords} test records...`);

        // Генерация данных
        for (let i = 0; i < totalRecords; i++) {
            const type = faker.helpers.arrayElement(['mortgage', 'auto', 'consumer', 'pension']);

            let calculation;
            switch (type) {
                case 'mortgage':
                    calculation = generateMortgageCalculation();
                    break;
                case 'auto':
                    calculation = generateAutoCalculation();
                    break;
                case 'consumer':
                    calculation = generateConsumerCalculation();
                    break;
                case 'pension':
                    calculation = generatePensionCalculation();
                    break;
            }

            allCalculations.push(calculation);

            // Прогресс
            if ((i + 1) % 30 === 0) {
                console.log(`   Generated ${i + 1} records...`);
            }
        }

        // Вставка в базу данных
        await Calculation.insertMany(allCalculations);
        console.log(`\n ${allCalculations.length} test records inserted successfully`);

        // Статистика
        const counts = await Calculation.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        console.log('\n Database Statistics:');
        counts.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count} records`);
        });

        // Примеры записей
        console.log('\n Sample records:');
        const samples = await Calculation.aggregate([
            { $sample: { size: 5 } },
            {
                $project: {
                    type: 1,
                    userEmail: 1,
                    monthlyPayment: 1,
                    createdAt: 1,
                    loanType: 1
                }
            }
        ]);

        samples.forEach((record, index) => {
            console.log(`   ${index + 1}. ${record.type} (${record.loanType || 'N/A'}) - ${record.userEmail} - ${record.monthlyPayment || 'N/A'}₽`);
        });

        process.exit(0);
    } catch (error) {
        console.error(' Error generating test data:', error);
        process.exit(1);
    }
};

// Запуск скрипта
const run = async () => {
    await connectDB();
    await generateTestData();
};

run();