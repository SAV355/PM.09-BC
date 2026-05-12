const CalculatorConfig = require('../models/CalculatorConfig');

const defaultCalculators = [
    {
        name: 'mortgage',
        type: 'mortgage',
        displayName: 'Ипотека',
        description: 'Рассчёт ипотечного кредита на жильё',
        icon: 'HomeIcon',
        color: '#1E3A8A',
        fields: [
            { name: 'propertyCost', label: 'Стоимость недвижимости, ₽', type: 'number', required: true, min: 100000, step: 100000, defaultValue: 5000000 },
            { name: 'initialPayment', label: 'Первоначальный взнос, ₽', type: 'number', required: true, min: 0, step: 100000, defaultValue: 1000000 },
            { name: 'termYears', label: 'Срок кредита, лет', type: 'number', required: true, min: 1, max: 30, step: 1, defaultValue: 20 },
            { name: 'propertyType', label: 'Тип недвижимости', type: 'select', options: ['primary', 'secondary', 'commercial'], defaultValue: 'primary' },
            { name: 'loanType', label: 'Тип кредита', type: 'select', options: ['standard', 'express', 'family'], defaultValue: 'standard' },
        ],
        rates: {
            baseRate: 9.6,
            adjustments: [
                { field: 'propertyType', value: 'secondary', adjustment: 0.5 },
                { field: 'propertyType', value: 'commercial', adjustment: 1.5 },
                { field: 'loanType', value: 'express', adjustment: 2.0 },
            ],
        },
        extraParams: {
            incomeMultiplier: 2.5,
        },
        order: 1,
    },
    {
        name: 'auto',
        type: 'auto',
        displayName: 'Автокредит',
        description: 'Расчёт кредита на автомобиль',
        icon: 'DirectionsCarIcon',
        color: '#10B981',
        fields: [
            { name: 'carCost', label: 'Стоимость автомобиля, ₽', type: 'number', required: true, min: 50000, step: 50000, defaultValue: 1500000 },
            { name: 'initialPayment', label: 'Первоначальный взнос, ₽', type: 'number', required: true, min: 0, step: 50000, defaultValue: 300000 },
            { name: 'termYears', label: 'Срок кредита, лет', type: 'number', required: true, min: 1, max: 7, step: 1, defaultValue: 5 },
            { name: 'carType', label: 'Тип автомобиля', type: 'select', options: ['new', 'used', 'premium'], defaultValue: 'new' },
            { name: 'loanType', label: 'Тип кредита', type: 'select', options: ['standard', 'express', 'family'], defaultValue: 'standard' },
        ],
        rates: {
            baseRate: 3.5,
            adjustments: [
                { field: 'carType', value: 'used', adjustment: 1.5 },
                { field: 'carType', value: 'premium', adjustment: -0.5 },
                { field: 'loanType', value: 'express', adjustment: 2.0 },
                { field: 'loanType', value: 'family', adjustment: -0.3 },
            ],
        },
        extraParams: {
            insurancePercent: 0.5,
            incomeMultiplier: 2.0,
        },
        order: 2,
    },
    // consumer, pension аналогично
];

const seedCalculators = async () => {
    try {
        await CalculatorConfig.deleteMany({});
        await CalculatorConfig.insertMany(defaultCalculators);
        console.log('✅ Calculators seeded');
    } catch (err) {
        console.error('❌ Seeding error:', err);
    }
};
module.exports = seedCalculators;