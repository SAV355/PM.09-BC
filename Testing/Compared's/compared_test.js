import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateCalculationPDF = (type, formData, results, title) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleString('ru-RU');

    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Дата расчёта: ${currentDate}`, 14, 32);

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0 ₽';
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // ---- Параметры расчёта ----
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Параметры расчёта', 14, 45);

    let paramRows = [];
    switch (type) {
        case 'pension':
            paramRows = [
                ['Тип пенсии', formData.pensionType === 'state' ? 'Государственная' :
                    formData.pensionType === 'private' ? 'Частная' : 'Смешанная'],
                ['Тип инвестирования', formData.investmentType === 'conservative' ? 'Консервативный' :
                    formData.investmentType === 'moderate' ? 'Умеренный' : 'Агрессивный'],
                ['Текущий возраст', `${formData.currentAge} лет`],
                ['Возраст выхода на пенсию', `${formData.retirementAge} лет`],
                ['Текущие накопления', formatCurrency(formData.currentSavings)],
                ['Ежемесячные взносы', formatCurrency(formData.monthlyContribution)],
                ['Ожидаемая доходность', `${formData.expectedReturn}%`],
            ];
            break;
        // при необходимости добавьте другие типы (mortgage, auto, consumer)
        default: break;
    }

    autoTable(doc, {
        startY: 50,
        head: [['Параметр', 'Значение']],
        body: paramRows,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] },
        margin: { left: 14, right: 14 },
    });

    // ---- Результаты расчёта ----
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Результаты расчёта', 14, finalY);

    let resultRows = [];
    if (type === 'pension') {
        resultRows = [
            ['Накопления к пенсии', formatCurrency(results.totalAtRetirement)],
            ['Ежемесячная пенсия', formatCurrency(results.monthlyPension)],
            ['Годовая пенсия', formatCurrency(results.totalAnnualPension)],
            ['Государственная часть', formatCurrency(results.statePension)],
            ['Частные накопления', formatCurrency(results.privatePension)],
        ];
    }

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Показатель', 'Значение']],
        body: resultRows,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 },
    });

    const fileName = `${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
    doc.save(fileName);
};