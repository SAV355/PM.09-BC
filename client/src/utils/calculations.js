// Формулы расчета ипотеки из ТЗ
export const calculateMortgage = (propertyCost, initialPayment, annualRate, termYears) => {
    const loanAmount = propertyCost - initialPayment;

    // Ежемесячная процентная ставка
    const monthlyRate = annualRate / 12 / 100;

    // Общее количество платежей
    const totalPayments = termYears * 12;

    // Общая ставка (1 + месячная ставка) ^ срок в месяцах
    const totalRate = Math.pow(1 + monthlyRate, totalPayments);

    // Ежемесячный платеж
    const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);

    // Общая сумма выплат
    const totalPayment = monthlyPayment * totalPayments;

    // Переплата
    const overpayment = totalPayment - loanAmount;

    // Необходимый доход (платеж × 2.5)
    const requiredIncome = monthlyPayment * 2.5;

    return {
        loanAmount,
        monthlyRate,
        totalRate,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        overpayment: Math.round(overpayment),
        requiredIncome: Math.round(requiredIncome),
        annualRate,
        termYears,
        propertyCost,
        initialPayment,
    };
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Расчеты для других кредитов (заготовки)
export const calculateAutoCredit = (carCost, initialPayment, termYears) => {
    const annualRate = 3.5; // Ставка из ТЗ
    return calculateMortgage(carCost, initialPayment, annualRate, termYears);
};

export const calculateConsumerCredit = (amount, termYears) => {
    const annualRate = 14.5; // Ставка из ТЗ
    return calculateMortgage(amount, 0, annualRate, termYears);
};