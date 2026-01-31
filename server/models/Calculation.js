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

  // Метрики
  calculationTime: Number, // время расчета в мс

  // Системные поля
  ipAddress: String,
  userAgent: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Индексы для быстрого поиска
calculationSchema.index({ type: 1, createdAt: -1 });
calculationSchema.index({ userEmail: 1 });
calculationSchema.index({ createdAt: -1 });

// Middleware для обновления updatedAt
calculationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Calculation = mongoose.model('Calculation', calculationSchema);

module.exports = Calculation;