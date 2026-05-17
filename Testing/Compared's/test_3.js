// ConsumerCreditCalculator
import React, { useState } from 'react';
import {
    TextField,
    Slider,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CalculatorLayout from './common/CalculatorLayout';
import ResultCard from './common/ResultCard';
import { formatCurrency } from '../utils/calculations';
import { generateCalculationPDF } from '../utils/generatePDF';
import { calculationsAPI } from '../services/api';
import { emailAPI } from '../services/emailService';

const ConsumerCreditCalculator = () => {
    const [formData, setFormData] = useState({
        loanAmount: 300000,
        termYears: 3,
        email: '',
        loanPurpose: 'consumer',
        loanType: 'standard',
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getInterestRate = () => {
        const { loanPurpose, loanType } = formData;
        let baseRate = 14.5;
        if (loanPurpose === 'education') baseRate -= 2;
        if (loanPurpose === 'medical') baseRate -= 1;
        if (loanPurpose === 'business') baseRate += 1;
        if (loanType === 'express') baseRate += 3;
        return baseRate;
    };

    const calculateConsumerCredit = () => {
        const { loanAmount, termYears } = formData;
        const annualRate = getInterestRate();
        const monthlyRate = annualRate / 12 / 100;
        const totalPayments = termYears * 12;
        const totalRate = Math.pow(1 + monthlyRate, totalPayments);
        const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
        const totalPayment = monthlyPayment * totalPayments;
        const overpayment = totalPayment - loanAmount;
        const requiredIncome = monthlyPayment * 2;

        return {
            loanAmount,
            monthlyPayment: Math.round(monthlyPayment),
            totalPayment: Math.round(totalPayment),
            overpayment: Math.round(overpayment),
            requiredIncome: Math.round(requiredIncome),
            annualRate,
            termYears,
        };
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'email' || type === 'text' || name === 'loanPurpose' || name === 'loanType') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            const numValue = parseFloat(value);
            setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
        }
        setError('');
    };

    const handleSliderChange = (name) => (e, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleCalculate = () => {
        try {
            setLoading(true);
            setError('');
            if (formData.loanAmount <= 0) {
                setError('Сумма кредита должна быть больше 0');
                return;
            }
            const calculation = calculateConsumerCredit();
            setResults(calculation);
            setSuccess('Расчет потребительского кредита выполнен успешно!');
        } catch (err) {
            setError('Ошибка при расчете: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async () => {
        const email = formData.email;
        if (!email) {
            setError('Введите email для отправки результатов');
            return;
        }
        if (!emailAPI.validateEmail(email)) {
            setError('Введите корректный email адрес');
            return;
        }
        if (!results) {
            setError('Сначала выполните расчёт');
            return;
        }
        try {
            setLoading(true);
            const emailData = emailAPI.formatEmailData('consumer', formData, results, null);
            const response = await calculationsAPI.sendEmail(emailData);
            if (response.data.success) {
                setSuccess('Результаты успешно отправлены на email!');
                setTimeout(() => setSuccess(''), 5000);
            } else {
                setError(response.data.error || 'Ошибка при отправке email');
            }
        } catch (err) {
            setError('Не удалось отправить email. Проверьте подключение к интернету.');
            console.error('Send email error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePDF = () => {
        if (!results) {
            setError('Сначала выполните расчёт');
            return;
        }
        try {
            generateCalculationPDF('consumer', formData, results, 'Калькулятор потребительского кредита');
            setSuccess('PDF документ сгенерирован и сохранен!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Ошибка при генерации PDF: ' + err.message);
        }
    };

    const annualRate = getInterestRate();

    const leftPanel = (
        <>
            <FormControl fullWidth margin="normal">
                <InputLabel>Цель кредита</InputLabel>
                <Select name="loanPurpose" value={formData.loanPurpose} onChange={handleInputChange} label="Цель кредита">
                    <MenuItem value="consumer">Потребительские нужды</MenuItem>
                    <MenuItem value="education">Образование</MenuItem>
                    <MenuItem value="medical">Медицинские услуги</MenuItem>
                    <MenuItem value="business">Бизнес</MenuItem>
                    <MenuItem value="travel">Путешествие</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Тип кредита</InputLabel>
                <Select name="loanType" value={formData.loanType} onChange={handleInputChange} label="Тип кредита">
                    <MenuItem value="standard">Стандартный кредит</MenuItem>
                    <MenuItem value="express">Экспресс-кредит</MenuItem>
                    <MenuItem value="secured">Кредит под залог</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>Сумма кредита: {formatCurrency(formData.loanAmount)}</Typography>
                <Slider value={formData.loanAmount} onChange={handleSliderChange('loanAmount')}
                    min={10000} max={5000000} step={10000} valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                    marks={[{ value: 100000, label: '100к' }, { value: 1000000, label: '1 млн' }, { value: 3000000, label: '3 млн' }]} />
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography gutterBottom>Срок кредита: {formData.termYears} лет</Typography>
                <Slider value={formData.termYears} onChange={handleSliderChange('termYears')}
                    min={1} max={7} valueLabelDisplay="auto" valueLabelFormat={(value) => `${value} лет`}
                    marks={[{ value: 1, label: '1 год' }, { value: 3, label: '3 года' }, { value: 5, label: '5 лет' }, { value: 7, label: '7 лет' }]} />
            </Box>
            <TextField fullWidth label="Email для отправки результатов" name="email" type="email"
                value={formData.email} onChange={handleInputChange} margin="normal" sx={{ mt: 3 }} placeholder="your@email.com" />
        </>
    );

    const rightPanel = (
        <>
            <Card sx={{ bgcolor: 'grey.50', mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><Typography variant="body2" color="text.secondary">Сумма кредита:</Typography><Typography variant="h6">{formatCurrency(formData.loanAmount)}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2" color="text.secondary">Процентная ставка:</Typography><Typography variant="h6" color="secondary.main">{annualRate.toFixed(1)}% годовых</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2" color="text.secondary">Цель кредита:</Typography><Typography variant="body1">{formData.loanPurpose === 'consumer' ? 'Потребительские нужды' : formData.loanPurpose === 'education' ? 'Образование' : formData.loanPurpose === 'medical' ? 'Медицинские услуги' : formData.loanPurpose === 'business' ? 'Бизнес' : 'Путешествие'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2" color="text.secondary">Срок кредита:</Typography><Typography variant="body1">{formData.termYears} лет</Typography></Grid>
                    </Grid>
                </CardContent>
            </Card>
            {results && (
                <Grid container spacing={2}>
                    <Grid item xs={12}><ResultCard title="Ежемесячный платеж" value={formatCurrency(results.monthlyPayment)} color="primary" size="xlarge" icon={AttachMoneyIcon} /></Grid>
                    <Grid item xs={6}><ResultCard title="Общая сумма выплат" value={formatCurrency(results.totalPayment)} color="info" size="medium" icon={AccountBalanceIcon} /></Grid>
                    <Grid item xs={6}><ResultCard title="Переплата по кредиту" value={formatCurrency(results.overpayment)} color="warning" size="medium" icon={TrendingUpIcon} /></Grid>
                    <Grid item xs={12}><ResultCard title="Необходимый доход" value={formatCurrency(results.requiredIncome)} color="success" size="large" subtitle="ежемесячный платеж × 2" icon={WarningIcon} /></Grid>
                    <Grid item xs={12}><ResultCard title="Эффективная ставка" value={`${(annualRate * 1.1).toFixed(1)}%`} color="secondary" size="medium" subtitle="с учетом всех комиссий" icon={LocalAtmIcon} /></Grid>
                </Grid>
            )}
            {!results && (
                <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 4, textAlign: 'center' }}>
                    <CreditCardIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>Введите параметры кредита</Typography>
                    <Typography variant="body2" color="text.secondary">Укажите сумму, срок и цель кредита для расчета</Typography>
                </Box>
            )}
        </>
    );

    return (
        <CalculatorLayout
            title="Калькулятор потребительского кредита"
            icon={CreditCardIcon}
            color="#8B5CF6"
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            error={error}
            success={success}
            loading={loading}
            onCalculate={handleCalculate}
            onSendEmail={handleSendEmail}
            onSavePDF={handleSavePDF}
            canCalculate={formData.loanAmount > 0}
        />
    );
};

export default ConsumerCreditCalculator;