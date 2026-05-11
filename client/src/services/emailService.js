import api from './api';

export const sendCalculationEmail = async (emailData) => {
    try {
        const response = await api.post('/calculations/send-email', emailData);
        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error.response?.data || { error: 'Ошибка сети' };
    }
};

export const emailAPI = {
    send: sendCalculationEmail,

    // Валидация email
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Форматирование данных для отправки
    formatEmailData: (type, formData, results, calculationId) => {
        // const typeLabels = {
        //     mortgage: 'Ипотека',
        //     auto: 'Автокредит',
        //     consumer: 'Потребительский кредит',
        //     pension: 'Пенсионные накопления'
        // };

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
            }).format(amount);
        };

        // Параметры для разных типов калькуляторов
        const getParameters = () => {
            switch (type) {
                case 'mortgage':
                    return {
                        'Тип недвижимости': formData.propertyType === 'primary' ? 'Первичная' :
                            formData.propertyType === 'secondary' ? 'Вторичная' : 'Коммерческая',
                        'Тип кредита': formData.loanType === 'standard' ? 'Стандартная' : 'Экспресс',
                        'Стоимость недвижимости': formatCurrency(formData.propertyCost),
                        'Первоначальный взнос': formatCurrency(formData.initialPayment),
                        'Срок кредита': `${formData.termYears} лет`,
                    };

                case 'auto':
                    return {
                        'Тип автомобиля': formData.carType === 'new' ? 'Новый' :
                            formData.carType === 'used' ? 'С пробегом' : 'Премиальный',
                        'Тип кредита': formData.loanType === 'standard' ? 'Стандартный' : 'Экспресс',
                        'Стоимость автомобиля': formatCurrency(formData.carCost),
                        'Первоначальный взнос': formatCurrency(formData.initialPayment),
                        'Срок кредита': `${formData.termYears} лет`,
                    };

                case 'consumer':
                    return {
                        'Цель кредита': formData.loanPurpose === 'consumer' ? 'Потребительские нужды' :
                            formData.loanPurpose === 'education' ? 'Образование' :
                                formData.loanPurpose === 'medical' ? 'Медицинские услуги' :
                                    formData.loanPurpose === 'business' ? 'Бизнес' : 'Путешествие',
                        'Тип кредита': formData.loanType === 'standard' ? 'Стандартный' : 'Экспресс',
                        'Сумма кредита': formatCurrency(formData.loanAmount),
                        'Срок кредита': `${formData.termYears} лет`,
                    };

                case 'pension':
                    return {
                        'Тип пенсии': formData.pensionType === 'state' ? 'Государственная' :
                            formData.pensionType === 'private' ? 'Частная' : 'Смешанная',
                        'Тип инвестирования': formData.investmentType === 'conservative' ? 'Консервативный' :
                            formData.investmentType === 'moderate' ? 'Умеренный' : 'Агрессивный',
                        'Текущий возраст': `${formData.currentAge} лет`,
                        'Возраст выхода на пенсию': `${formData.retirementAge} лет`,
                        'Текущие накопления': formatCurrency(formData.currentSavings),
                        'Ежемесячные взносы': formatCurrency(formData.monthlyContribution),
                    };

                default:
                    return {};
            }
        };

        // Результаты для email
        const getResults = () => {
            const commonResults = {
                'Ежемесячный платеж': formatCurrency(results.monthlyPayment),
                'Общая сумма выплат': formatCurrency(results.totalPayment),
            };

            switch (type) {
                case 'mortgage':
                    return {
                        ...commonResults,
                        'Переплата по кредиту': formatCurrency(results.overpayment),
                        'Необходимый доход': formatCurrency(results.requiredIncome),
                        'Процентная ставка': `${results.annualRate.toFixed(1) || '9.6'}%`,
                    };

                case 'auto':
                    return {
                        ...commonResults,
                        'Страховка (КАСКО)': formatCurrency(results.insurance),
                        'Общий ежемесячный платеж': formatCurrency(results.totalMonthlyPayment),
                        'Необходимый доход': formatCurrency(results.requiredIncome),
                    };

                case 'consumer':
                    return {
                        ...commonResults,
                        'Переплата': formatCurrency(results.overpayment),
                        'Необходимый доход': formatCurrency(results.requiredIncome),
                        'Эффективная ставка': `${(results.annualRate * 1.1).toFixed(1)}%`,
                    };

                case 'pension':
                    return {
                        'Накопления к пенсии': formatCurrency(results.totalAtRetirement),
                        'Ежемесячная пенсия': formatCurrency(results.monthlyPension),
                        'Годовая пенсия': formatCurrency(results.totalAnnualPension),
                        'Государственная часть': formatCurrency(results.statePension),
                        'Частные накопления': formatCurrency(results.privatePension),
                    };

                default:
                    return {};
            }
        };

        return {
            email: formData.email,
            calculationType: type,
            parameters: getParameters(),
            results: getResults(),
            calculationId: calculationId,
        };
    },
};