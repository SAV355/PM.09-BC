const mongoose = require('mongoose');

const calculatorConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['mortgage', 'auto', 'consumer', 'pension', 'other'],
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    description: String,
    icon: String, // имя иконки из библиотеки @mui/Icons-material
    color: String, // основной цвет калькулятора
    isActive: {
        type: Boolean,
        default: true,
    },
    // Параметры формы (динамические поля)
    fields: [{
        name: String,        // propertyCost, initialPayment, etc.
        label: String,
        type: { type: String, enum: ['number', 'text', 'select', 'range', 'email'] },
        required: Boolean,
        min: Number,
        max: Number,
        step: Number,
        options: [String],   // для select
        defaultValue: mongoose.Schema.Types.Mixed,
    }],
    // Процентные ставки в зависимости от выбранных параметров
    rates: {
        baseRate: Number,
        adjustments: [{
            field: String,
            value: String,
            adjustment: Number, // добавляется/вычитается из baseRate
        }],
    },
    // Дополнительные параметры расчета (например, коэффициент страховки)
    extraParams: {
        insurancePercent: Number,
        incomeMultiplier: Number,
    },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

calculatorConfigSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CalculatorConfig', calculatorConfigSchema);