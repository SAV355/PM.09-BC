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
    // Alert,
    // CircularProgress,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import SendIcon from '@mui/icons-material/Send';
// import DownloadIcon from '@mui/icons-material/Download';
import CalculatorLayout from './common/CalculatorLayout';
import ResultCard from './common/ResultCard';
import { formatCurrency } from '../utils/calculations';
import { generateCalculationPDF } from '../utils/generatePDF';
// import { emailAPI } from '../services/emailService';

const AutoCreditCalculator = () => {
    const [formData, setFormData] = useState({
        carCost: 1500000,
        initialPayment: 300000,
        termYears: 5,
        email: '',
        carType: 'new',
        loanType: 'standard',
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    //процентная ставка (зависит от типа авто/кредита)
    const getInterestRate = () => {
        const { carType, loanType } = formData;
        let baseRate = 3.5;

        //корректировака по (типу авто)
        if (carType === 'used') baseRate += 1.5;
        if (carType === 'premium') baseRate -= 0.5;
        //корректировака по (типу кредита)
        if (loanType === 'express') baseRate += 2;
        if (loanType === 'family') baseRate -= 0.3;

        return baseRate;
    };

    const calculateAutoCredit = () => {
        const { carCost, initialPayment, termYears } = formData;
        const annualRate = getInterestRate();
        //Расчет типа кредита (аналогичен «ипотечному»)
        const loanAmount = carCost - initialPayment;
        const monthlyRate = annualRate / 12 / 100;
        const totalPayments = termYears * 12;
        const totalRate = Math.pow(1 + monthlyRate, totalPayments);
        const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
        const totalPayment = monthlyPayment * totalPayments;
        const overpayment = totalPayment - loanAmount;
        const insurance = carCost * 0.005 / 12;
        const totalMonthlyPayment = monthlyPayment + insurance;
        const requiredIncome = totalMonthlyPayment * 2;

        return {
            loanAmount,
            monthlyPayment: Math.round(monthlyPayment),
            totalPayment: Math.round(totalPayment),
            overpayment: Math.round(overpayment),
            insurance: Math.round(insurance),
            totalMonthlyPayment: Math.round(totalMonthlyPayment),
            requiredIncome: Math.round(requiredIncome),
            annualRate,
            termYears,
        };
    };

    //обработчик текстовых полей
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        //для Email'a и текстовых полей
        if (type === 'email' || type === 'text' || name === 'carType' || name === 'loanType') {
            setFormData(prev => ({
                ...prev,
                [name]: value, // сохр. емайл как строку
            }));
        } else {
            //для числовых полей
            const numValue = parseFloat(value);
            setFormData(prev => ({
                ...prev,
                [name]: isNaN(numValue) ? 0 : numValue,
            }));
        }
        setError('');
    };

    //обработчик слайдеров
    const handleSliderChange = (name) => (e, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleCalculate = () => {
        try {
            setLoading(true);
            setError('');

            const loanAmount = formData.carCost - formData.initialPayment;
            if (loanAmount <= 0) {
                setError('Сумма кредита должна быть больше 0');
                return;
            }

            const calculation = calculateAutoCredit();
            setResults(calculation);
            setSuccess('Расчет автокредита выполнен успешно!');

        } catch (err) {
            setError('Ошибка при расчете: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = () => {
        if (!formData.email) {
            setError('Введите email для отправки результатов');
            return;
        }
        setSuccess('Результаты отправлены на email!');
    };

    const handleSavePDF = () => {
        if (!results) {
            setError('Сначала выполните расчёт');
            return;
        }
        try {
            generateCalculationPDF('auto', formData, results, 'Калькулятор Автокредита');
            setSuccess('PDF документ сгенерирован и сохранен!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Ошибка при генерации PDF: ' + err.message);
        }
    };

    const loanAmount = formData.carCost - formData.initialPayment;
    const annualRate = getInterestRate();

    // Левая панель - форма ввода
    const leftPanel = (
        <>
            <FormControl fullWidth margin="normal">
                <InputLabel>Тип автомобиля</InputLabel>
                <Select
                    name="carType"
                    value={formData.carType}
                    onChange={handleInputChange}
                    label="Тип автомобиля"
                >
                    <MenuItem value="new">Новый автомобиль</MenuItem>
                    <MenuItem value="used">Автомобиль с пробегом</MenuItem>
                    <MenuItem value="premium">Премиальный автомобиль</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Тип кредита</InputLabel>
                <Select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    label="Тип кредита"
                >
                    <MenuItem value="standard">Стандартный</MenuItem>
                    <MenuItem value="express">Экспресс-кредит</MenuItem>
                    <MenuItem value="family">Семейный кредит</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Стоимость автомобиля, ₽"
                name="carCost"
                type="number"
                value={formData.carCost}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ inputProps: { min: 500000, step: 50000 } }}
            />

            <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>
                    Первоначальный взнос: {formatCurrency(formData.initialPayment)}
                </Typography>
                <Slider
                    value={formData.initialPayment}
                    onChange={handleSliderChange('initialPayment')}
                    min={0}
                    max={formData.carCost}
                    step={50000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                />
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography gutterBottom>
                    Срок кредита: {formData.termYears} лет
                </Typography>
                <Slider
                    value={formData.termYears}
                    onChange={handleSliderChange('termYears')}
                    min={1}
                    max={7}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} лет`}
                />
            </Box>

            <TextField
                fullWidth
                label="Email для отправки результатов"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                sx={{ mt: 3 }}
                placeholder="your@email.com"
            />
        </>
    );

    // Правая панель - результаты
    const rightPanel = (
        <>
            <Card sx={{ bgcolor: 'grey.50', mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Сумма кредита:
                            </Typography>
                            <Typography variant="h6">
                                {formatCurrency(loanAmount)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Процентная ставка:
                            </Typography>
                            <Typography variant="h6" color="secondary.main">
                                {annualRate.toFixed(1)}% годовых
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Тип авто:
                            </Typography>
                            <Typography variant="body1">
                                {formData.carType === 'new' ? 'Новый' :
                                    formData.carType === 'used' ? 'С пробегом' : 'Премиальный'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Срок кредита:
                            </Typography>
                            <Typography variant="body1">
                                {formData.termYears} лет
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {results && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ResultCard
                            title="Ежемесячный платеж по кредиту"
                            value={formatCurrency(results.monthlyPayment)}
                            color="primary"
                            size="xlarge"
                            icon={AttachMoneyIcon}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <ResultCard
                            title="Страховка (КАСКО)"
                            value={formatCurrency(results.insurance)}
                            color="info"
                            size="medium"
                            icon={LocalShippingIcon}
                            subtitle="в месяц"
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <ResultCard
                            title="Общий платеж"
                            value={formatCurrency(results.totalMonthlyPayment)}
                            color="success"
                            size="medium"
                            icon={AccountBalanceIcon}
                            subtitle="в месяц"
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <ResultCard
                            title="Общая сумма выплат"
                            value={formatCurrency(results.totalPayment)}
                            color="warning"
                            size="small"
                            icon={TrendingUpIcon}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <ResultCard
                            title="Переплата"
                            value={formatCurrency(results.overpayment)}
                            color="error"
                            size="small"
                            icon={WarningIcon}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ResultCard
                            title="Необходимый доход"
                            value={formatCurrency(results.requiredIncome)}
                            color="secondary"
                            size="medium"
                            subtitle="общий платеж × 2"
                            icon={ScheduleIcon}
                        />
                    </Grid>
                </Grid>
            )}

            {!results && (
                <Box sx={{
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center'
                }}>
                    <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Введите параметры автокредита
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Укажите стоимость авто, первоначальный взнос и срок кредита для расчета
                    </Typography>
                </Box>
            )}
        </>
    );

    return (
        <CalculatorLayout
            title="Калькулятор автокредита"
            icon={DirectionsCarIcon}
            color="#10B981"
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            error={error}
            success={success}
            loading={loading}
            onCalculate={handleCalculate}
            onSendEmail={handleSendEmail}
            onSavePDF={handleSavePDF}
            canCalculate={loanAmount > 0}
        />
    );
};

export default AutoCreditCalculator;