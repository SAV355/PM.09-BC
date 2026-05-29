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

// Тестовые данные - ипотека
const mortgageCalculations = [
    {
        type: 'mortgage',
        propertyCost: 5000000,
        initialPayment: 1000000,
        loanAmount: 4000000,
        annualRate: 9.6,
        termYears: 20,
        monthlyPayment: 37640,
        totalPayment: 9033600,
        overpayment: 5033600,
        requiredIncome: 94100,
        monthlyRate: 0.008,
        totalRate: 6.77,
        userEmail: 'test1@example.com',
        propertyType: 'primary',
        loanType: 'standard',
        calculationMethod: 'standard',
        createdAt: new Date('2024-01-15'),
    },
    {
        type: 'mortgage',
        propertyCost: 8000000,
        initialPayment: 2000000,
        loanAmount: 6000000,
        annualRate: 9.6,
        termYears: 15,
        monthlyPayment: 62945,
        totalPayment: 11330100,
        overpayment: 5330100,
        requiredIncome: 157363,
        monthlyRate: 0.008,
        totalRate: 4.72,
        userEmail: 'test2@example.com',
        propertyType: 'secondary',
        loanType: 'express',
        calculationMethod: 'standard',
        createdAt: new Date('2024-01-20'),
    },
    {
        type: 'mortgage',
        propertyCost: 12000000,
        initialPayment: 3000000,
        loanAmount: 9000000,
        annualRate: 9.6,
        termYears: 25,
        monthlyPayment: 79635,
        totalPayment: 23890500,
        overpayment: 14890500,
        requiredIncome: 199088,
        monthlyRate: 0.008,
        totalRate: 8.85,
        userEmail: 'test3@example.com',
        propertyType: 'commercial',
        loanType: 'standard',
        calculationMethod: 'standard',
        createdAt: new Date('2024-02-01'),
    },
];

// Тестовые данные - автокредит
const autoCalculations = [
    {
        type: 'auto',
        propertyCost: 1500000,
        initialPayment: 300000,
        loanAmount: 1200000,
        annualRate: 3.5,
        termYears: 5,
        monthlyPayment: 21850,
        totalPayment: 1311000,
        overpayment: 111000,
        requiredIncome: 43700,
        monthlyRate: 0.0029167,
        totalRate: 1.19,
        userEmail: 'auto1@example.com',
        carType: 'new',
        loanType: 'standard',
        insurance: 625,
        totalMonthlyPayment: 22475,
        calculationMethod: 'standard',
        createdAt: new Date('2024-01-10'),
    },
    {
        type: 'auto',
        propertyCost: 2500000,
        initialPayment: 500000,
        loanAmount: 2000000,
        annualRate: 5.0,
        termYears: 7,
        monthlyPayment: 28250,
        totalPayment: 2373000,
        overpayment: 373000,
        requiredIncome: 56500,
        monthlyRate: 0.0041667,
        totalRate: 1.32,
        userEmail: 'auto2@example.com',
        carType: 'used',
        loanType: 'express',
        insurance: 1042,
        totalMonthlyPayment: 29292,
        calculationMethod: 'standard',
        createdAt: new Date('2024-02-05'),
    },
];

// Тестовые данные - потребительский кредит
const consumerCalculations = [
    {
        type: 'consumer',
        propertyCost: 300000,
        initialPayment: 0,
        loanAmount: 300000,
        annualRate: 14.5,
        termYears: 3,
        monthlyPayment: 10320,
        totalPayment: 371520,
        overpayment: 71520,
        requiredIncome: 20640,
        monthlyRate: 0.0120833,
        totalRate: 1.43,
        userEmail: 'consumer1@example.com',
        loanPurpose: 'consumer',
        loanType: 'standard',
        calculationMethod: 'standard',
        createdAt: new Date('2024-01-25'),
    },
    {
        type: 'consumer',
        propertyCost: 1000000,
        initialPayment: 0,
        loanAmount: 1000000,
        annualRate: 12.5,
        termYears: 5,
        monthlyPayment: 22490,
        totalPayment: 1349400,
        overpayment: 349400,
        requiredIncome: 44980,
        monthlyRate: 0.0104167,
        totalRate: 1.82,
        userEmail: 'consumer2@example.com',
        loanPurpose: 'education',
        loanType: 'secured',
        calculationMethod: 'standard',
        createdAt: new Date('2024-02-10'),
    },
];

// Тестовые данные - пенсионные накопления
const pensionCalculations = [
    {
        type: 'pension',
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 500000,
        monthlyContribution: 20000,
        expectedReturn: 7,
        inflationRate: 4,
        totalAtRetirement: 24567321,
        monthlyPension: 81891,
        totalAnnualPension: 982692,
        statePension: 384000,
        privatePension: 598692,
        userEmail: 'pension1@example.com',
        pensionType: 'mixed',
        investmentType: 'moderate',
        calculationMethod: 'standard',
        createdAt: new Date('2024-01-30'),
    },
    {
        type: 'pension',
        currentAge: 45,
        retirementAge: 65,
        currentSavings: 1500000,
        monthlyContribution: 50000,
        expectedReturn: 5,
        inflationRate: 4,
        totalAtRetirement: 28765432,
        monthlyPension: 95885,
        totalAnnualPension: 1150620,
        statePension: 480000,
        privatePension: 670620,
        userEmail: 'pension2@example.com',
        pensionType: 'private',
        investmentType: 'conservative',
        calculationMethod: 'standard',
        createdAt: new Date('2024-02-15'),
    },
];

//ярлыки для функций (скачанные из интернета ✅❌🗑️📊📋)
// Основная функция заполнения DB
const seedDatabase = async () => {
    try {
        // Очистка существующих данных 
        await Calculation.deleteMany({});
        console.log('  Existing data cleared');

//  новые данные «ярлык»
        const allCalculations = [
            ...mortgageCalculations,
            ...autoCalculations,
            ...consumerCalculations,
            ...pensionCalculations
        ];

        await Calculation.insertMany(allCalculations);
        console.log(` ${allCalculations.length} records inserted successfully`);

// Показ статистики 
        const counts = await Calculation.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        console.log('\n Database Statistics:');
        counts.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count} records`);
        });

// Показ нескольких примеров 
        console.log('\n Sample records:');
        const samples = await Calculation.find().limit(3).select('type userEmail monthlyPayment createdAt');
        samples.forEach((record, index) => {
            console.log(`   ${index + 1}. ${record.type} - ${record.userEmail} - ${record.monthlyPayment}₽`);
        });

        process.exit(0);
    } catch (error) {
        console.error(' Error seeding database:', error);
        process.exit(1);
    }
};

// Запуск скрипта
const run = async () => {
    await connectDB();
    await seedDatabase();
};

run();