const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mortgage', 'auto', 'consumer', 'pension'],
    required: true,
  },

  // Основные параметры
  propertyCost: Number,
  initialPayment: Number,
  loanAmount: Number,
  annualRate: Number,
  termYears: Number,

  // Результаты расчета
  monthlyPayment: Number,
  totalPayment: Number,
  overpayment: Number,
  requiredIncome: Number,
  monthlyRate: Number,
  totalRate: Number,

  // Пользовательские данные
  userEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },

  // Метод расчета
  calculationMethod: {
    type: String,
    default: 'standard',
  },

  // Метрики (время расчета в мс)
  calculationTime: Number,

  // Системные поля
  ipAddress: String,
  userAgent: String,

  // Временные метки 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Индексы быстрого поиска
calculationSchema.index({ type: 1, createdAt: -1 });
calculationSchema.index({ userEmail: 1 });
calculationSchema.index({ createdAt: -1 });

// Middleware(прослойка) для обновления updatedAt
calculationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Calculation = mongoose.model('Calculation', calculationSchema);

module.exports = Calculation;