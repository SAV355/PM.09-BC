import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCalculationPDF = async (type, formData, results, title) => {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.top = '-9999px';
    element.style.left = '-9999px';
    element.style.width = '800px';
    element.style.backgroundColor = 'white';
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.innerHTML = generateHTMLContent(type, formData, results, title);
    document.body.appendChild(element);

    try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
        pdf.save(fileName);
    } finally {
        document.body.removeChild(element);
    }
};

function generateHTMLContent(type, formData, results, title) {
    const currentDate = new Date().toLocaleString('ru-RU');
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0 ₽';
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(amount);
    };

    let paramsHtml = '';
    let resultsHtml = '';

    switch (type) {
        case 'mortgage':
            paramsHtml = `
        <tr><td>Тип недвижимости</td><td>${formData.propertyType === 'primary' ? 'Первичная' : formData.propertyType === 'secondary' ? 'Вторичная' : 'Коммерческая'}</td></tr>
        <tr><td>Тип кредита</td><td>${formData.loanType === 'standard' ? 'Стандартная' : formData.loanType === 'express' ? 'Экспресс' : 'Семейная'}</td></tr>
        <tr><td>Стоимость недвижимости</td><td>${formatCurrency(formData.propertyCost)}</td></tr>
        <tr><td>Первоначальный взнос</td><td>${formatCurrency(formData.initialPayment)}</td></tr>
        <tr><td>Срок кредита</td><td>${formData.termYears} лет (${formData.termYears * 12} месяцев)</td></tr>
        <tr><td>Процентная ставка</td><td>${results.annualRate?.toFixed(1) || '9.6'}%</td></tr>
      `;
            resultsHtml = `
        <tr><td>Сумма кредита</td><td>${formatCurrency(results.loanAmount)}</td></tr>
        <tr><td>Ежемесячный платёж</td><td>${formatCurrency(results.monthlyPayment)}</td></tr>
        <tr><td>Общая сумма выплат</td><td>${formatCurrency(results.totalPayment)}</td></tr>
        <tr><td>Переплата</td><td>${formatCurrency(results.overpayment)}</td></tr>
        <tr><td>Необходимый доход</td><td>${formatCurrency(results.requiredIncome)}</td></tr>
      `;
            break;
        case 'auto':
            paramsHtml = `
        <tr><td>Тип автомобиля</td><td>${formData.carType === 'new' ? 'Новый' : formData.carType === 'used' ? 'С пробегом' : 'Премиальный'}</td></tr>
        <tr><td>Тип кредита</td><td>${formData.loanType === 'standard' ? 'Стандартный' : 'Экспресс'}</td></tr>
        <tr><td>Стоимость автомобиля</td><td>${formatCurrency(formData.carCost)}</td></tr>
        <tr><td>Первоначальный взнос</td><td>${formatCurrency(formData.initialPayment)}</td></tr>
        <tr><td>Срок кредита</td><td>${formData.termYears} лет</td></tr>
        <tr><td>Процентная ставка</td><td>${results.annualRate?.toFixed(1) || '3.5'}%</td></tr>
      `;
            resultsHtml = `
        <tr><td>Ежемесячный платёж</td><td>${formatCurrency(results.monthlyPayment)}</td></tr>
        <tr><td>Страховка КАСКО</td><td>${formatCurrency(results.insurance)}</td></tr>
        <tr><td>Общий ежемесячный платёж</td><td>${formatCurrency(results.totalMonthlyPayment)}</td></tr>
        <tr><td>Общая сумма выплат</td><td>${formatCurrency(results.totalPayment)}</td></tr>
        <tr><td>Переплата</td><td>${formatCurrency(results.overpayment)}</td></tr>
        <tr><td>Необходимый доход</td><td>${formatCurrency(results.requiredIncome)}</td></tr>
      `;
            break;
        case 'consumer':
            paramsHtml = `
        <tr><td>Цель кредита</td><td>${formData.loanPurpose === 'consumer' ? 'Потребительские нужды' : formData.loanPurpose === 'education' ? 'Образование' : formData.loanPurpose === 'medical' ? 'Медицина' : 'Другое'}</td></tr>
        <tr><td>Тип кредита</td><td>${formData.loanType === 'standard' ? 'Стандартный' : 'Экспресс'}</td></tr>
        <tr><td>Сумма кредита</td><td>${formatCurrency(formData.loanAmount)}</td></tr>
        <tr><td>Срок кредита</td><td>${formData.termYears} лет</td></tr>
        <tr><td>Процентная ставка</td><td>${results.annualRate?.toFixed(1) || '14.5'}%</td></tr>
      `;
            resultsHtml = `
        <tr><td>Ежемесячный платёж</td><td>${formatCurrency(results.monthlyPayment)}</td></tr>
        <tr><td>Общая сумма выплат</td><td>${formatCurrency(results.totalPayment)}</td></tr>
        <tr><td>Переплата</td><td>${formatCurrency(results.overpayment)}</td></tr>
        <tr><td>Необходимый доход</td><td>${formatCurrency(results.requiredIncome)}</td></tr>
        <tr><td>Эффективная ставка</td><td>${(results.annualRate * 1.1).toFixed(1)}%</td></tr>
      `;
            break;
        case 'pension':
            paramsHtml = `
        <tr><td>Тип пенсии</td><td>${formData.pensionType === 'state' ? 'Государственная' : formData.pensionType === 'private' ? 'Частная' : 'Смешанная'}</td></tr>
        <tr><td>Тип инвестирования</td><td>${formData.investmentType === 'conservative' ? 'Консервативный' : formData.investmentType === 'moderate' ? 'Умеренный' : 'Агрессивный'}</td></tr>
        <tr><td>Текущий возраст</td><td>${formData.currentAge} лет</td></tr>
        <tr><td>Возраст выхода на пенсию</td><td>${formData.retirementAge} лет</td></tr>
        <tr><td>Текущие накопления</td><td>${formatCurrency(formData.currentSavings)}</td></tr>
        <tr><td>Ежемесячные взносы</td><td>${formatCurrency(formData.monthlyContribution)}</td></tr>
        <tr><td>Ожидаемая доходность</td><td>${formData.expectedReturn}%</td></tr>
      `;
            resultsHtml = `
        <tr><td>Накопления к пенсии</td><td>${formatCurrency(results.totalAtRetirement)}</td></tr>
        <tr><td>Ежемесячная пенсия</td><td>${formatCurrency(results.monthlyPension)}</td></tr>
        <tr><td>Годовая пенсия</td><td>${formatCurrency(results.totalAnnualPension)}</td></tr>
        <tr><td>Государственная часть</td><td>${formatCurrency(results.statePension)}</td></tr>
        <tr><td>Частные накопления</td><td>${formatCurrency(results.privatePension)}</td></tr>
      `;
            break;
        default:
            paramsHtml = '<tr><td colspan="2">Нет данных</td></tr>';
            resultsHtml = '<tr><td colspan="2">Нет данных</td></tr>';
    }

    return `
    <div style="width: 100%; max-width: 750px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #1E3A8A;">${title}</h1>
      <p style="color: #666; font-size: 12px;">Дата расчёта: ${currentDate}</p>
      <h2 style="margin-top: 20px;">Параметры расчёта</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead><tr style="background-color: #1E3A8A; color: white;"><th>Параметр</th><th>Значение</th></tr></thead>
        <tbody>${paramsHtml}</tbody>
      </table>
      <h2>Результаты расчёта</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead><tr style="background-color: #10B981; color: white;"><th>Показатель</th><th>Значение</th></tr></thead>
        <tbody>${resultsHtml}</tbody>
      </table>
      <p style="margin-top: 30px; font-size: 10px; color: #999;">© Банковский калькулятор</p>
    </div>
  `;
}