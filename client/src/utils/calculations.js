// Формулы расчета ипотеки
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

// Автокредит

export const calculateAutoCredit = (carCost, initialPayment, termYears, carType = 'new', loanType = 'standard') => {
// Базовая ставка по ТЗ
    let annualRate = 3.5;

// Корректировка ставки
    if (carType === 'used') annualRate += 1.5;
    if (carType === 'premium') annualRate -= 0.5;
    if (loanType === 'express') annualRate += 2;
    if (loanType === 'family') annualRate -= 0.3;

// Расчет 
    const loanAmount = carCost - initialPayment;
    const monthlyRate = annualRate / 12 / 100;
    const totalPayments = termYears * 12;
    const totalRate = Math.pow(1 + monthlyRate, totalPayments);
    const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
    const totalPayment = monthlyPayment * totalPayments;
    const overpayment = totalPayment - loanAmount;

// Доп/расходы (Страховка КАСКО ~0.5% в месяц)
    const insurance = carCost * 0.005 / 12; 
    const totalMonthlyPayment = monthlyPayment + insurance;
    const requiredIncome = totalMonthlyPayment * 2;

    return {
        loanAmount,
        monthlyRate,
        totalRate,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        overpayment: Math.round(overpayment),
        insurance: Math.round(insurance),
        totalMonthlyPayment: Math.round(totalMonthlyPayment),
        requiredIncome: Math.round(requiredIncome),
        annualRate,
        termYears,
        carCost,
        initialPayment,
        carType,
        loanType,
    };
};

// Расчет пенсионных накоплений
export const calculatePensionSavings = ( 
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    inflationRate
) => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;

// Доход в месяц
    const monthlyReturn = annualReturn / 12 / 100;

// Расчет будущей стоимости, текущих накоплений
    let futureValue = currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);

// Расчет будущей стоимости, регулярных взносов
    let futureContributions = 0;
    for (let i = 0; i < monthsToRetirement; i++) {
        futureContributions += monthlyContribution * Math.pow(1 + monthlyReturn, monthsToRetirement - i);
    }

// Общая сумма на момент выхода на пенсию
    const totalAtRetirement = futureValue + futureContributions;

// Стоимость с учетом инфляции
    const realValue = totalAtRetirement / Math.pow(1 + (inflationRate / 100), yearsToRetirement);

// Безопасный коэффициент снятия (4% в год)
    const safeWithdrawalRate = 0.04;
    const annualPension = totalAtRetirement * safeWithdrawalRate;
    const monthlyPension = annualPension / 12;

    return {
        yearsToRetirement,
        totalAtRetirement: Math.round(totalAtRetirement),
        realValue: Math.round(realValue),
        annualPension: Math.round(annualPension),
        monthlyPension: Math.round(monthlyPension),
        futureValue: Math.round(futureValue),
        futureContributions: Math.round(futureContributions),
    };
};

// Расчет государственной пенсии (упрощенный)
export const calculateStatePension = (salary, yearsOfWork = 40) => {
// Упр. формула: 40% от «средней» ЗП
    const basePension = salary * 0.4 * 12;

// Коэффициент за стаж (1% за каждый год сверх 15 лет)
    const experienceBonus = Math.max(0, yearsOfWork - 15) * 0.01;

    return Math.round(basePension * (1 + experienceBonus));
};