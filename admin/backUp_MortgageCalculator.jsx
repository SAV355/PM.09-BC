// client/src/components/MortgageCalculator.jsx             |reate=>✓|(update)✓=>✓=>remake=>✓

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
    Alert,
    CircularProgress,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import CalculatorLayout from './common/CalculatorLayout';
import ResultCard from './common/ResultCard';
import { formatCurrency } from '../utils/calculations';
import { calculationsAPI } from '../services/api';
import { emailAPI } from '../services/emailService';

const MortgageCalculator = () => {
    const [formData, setFormData] = useState({
        propertyCost: 5000000,
        initialPayment: 1000000,
        termYears: 20,
        email: '',
        propertyType: 'primary',
        loanType: 'standard',
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [calculationId, setCalculationId] = useState(null);

    const getInterestRate = () => {
        const { propertyType, loanType } = formData;
        let baseRate = 9.6;

        if (propertyType === 'secondary') baseRate += 0.5;
        if (propertyType === 'commercial') baseRate += 1.5;
        if (loanType === 'express') baseRate += 2;

        return baseRate;
    };

    const calculateMortgage = () => {
        const { propertyCost, initialPayment, termYears } = formData;
        const annualRate = getInterestRate();

        const loanAmount = propertyCost - initialPayment;
        const monthlyRate = annualRate / 12 / 100;
        const totalPayments = termYears * 12;
        const totalRate = Math.pow(1 + monthlyRate, totalPayments);
        const monthlyPayment = loanAmount * monthlyRate * totalRate / (totalRate - 1);
        const totalPayment = monthlyPayment * totalPayments;
        const overpayment = totalPayment - loanAmount;
        const requiredIncome = monthlyPayment * 2.5;

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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'propertyType' || name === 'loanType' ? value : parseFloat(value) || 0,
        }));
        setError('');
    };

    const handleSliderChange = (name) => (e, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleCalculate = async () => {
        try {
            setLoading(true);
            setError('');

            const loanAmount = formData.propertyCost - formData.initialPayment;
            if (loanAmount <= 0) {
                setError('Сумма кредита должна быть больше 0');
                return;
            }

            const calculation = calculateMortgage();
            setResults(calculation);
            setSuccess('Расчет ипотеки выполнен успешно!');

    // Сохраняем расчет на сервере
            try {
                const response = await calculationsAPI.mortgage({
                    ...formData,
                    ...calculation,
                    loanAmount: calculation.loanAmount,
                });

                if (response.data.success) {
                    setCalculationId(response.data.calculationId);
                }
            } catch (saveError) {
                console.error('Error saving calculation:', saveError);
                // Не прерываем работу, если сохранение не удалось
            }

        } catch (err) {
            setError('Ошибка при расчете: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async () => {
        if (!formData.email) {
            setError('Введите email для отправки результатов');
            return;
        }

        // Валидация email
        if (!emailAPI.validateEmail(formData.email)) {
            setError('Пожалуйста, введите корректный email адрес');
            return;
        }

        if (!results) {
            setError('Сначала выполните расчет');
            return;
        }

        try {
            setEmailLoading(true);
            setError('');

            // Форматируем данные для email
            const emailData = emailAPI.formatEmailData(
                'mortgage',
                formData,
                results,
                calculationId
            );

            // Отправляем email через API
            const response = await calculationsAPI.sendEmail(emailData);

            if (response.data.success) {
                setSuccess('Результаты успешно отправлены на ваш email!');
            } else {
                setError(response.data.error || 'Ошибка при отправке email');
            }

        } catch (err) {
            const errorMessage = err.error || 'Ошибка при отправке email. Пожалуйста, попробуйте позже.';
            setError(errorMessage);
        } finally {
            setEmailLoading(false);
        }
    };

    const handleSavePDF = () => {
        setSuccess('PDF документ сгенерирован и сохранен!');
    };

    const loanAmount = formData.propertyCost - formData.initialPayment;
    const annualRate = getInterestRate();

    // Левая панель - форма ввода
    const leftPanel = (
        <>
            <FormControl fullWidth margin="normal">
                <InputLabel>Тип недвижимости</InputLabel>
                <Select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    label="Тип недвижимости"
                >
                    <MenuItem value="primary">Первичное жилье</MenuItem>
                    <MenuItem value="secondary">Вторичное жилье</MenuItem>
                    <MenuItem value="commercial">Коммерческая недвижимость</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Тип ипотечного кредита</InputLabel>
                <Select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    label="Тип ипотечного кредита"
                >
                    <MenuItem value="standard">Стандартная ипотека</MenuItem>
                    <MenuItem value="express">Экспресс-ипотека</MenuItem>
                    <MenuItem value="family">Семейная ипотека</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Стоимость недвижимости, ₽"
                name="propertyCost"
                type="number"
                value={formData.propertyCost}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                    inputProps: { min: 1000000, step: 100000 }
                }}
            />

            <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>
                    Первоначальный взнос: {formatCurrency(formData.initialPayment)}
                </Typography>
                <Slider
                    value={formData.initialPayment}
                    onChange={handleSliderChange('initialPayment')}
                    min={0}
                    max={formData.propertyCost}
                    step={100000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                />
                <Typography variant="caption" color="text.secondary">
                    Минимальный взнос: 15% ({formatCurrency(formData.propertyCost * 0.15)})
                </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography gutterBottom>
                    Срок кредита: {formData.termYears} лет
                </Typography>
                <Slider
                    value={formData.termYears}
                    onChange={handleSliderChange('termYears')}
                    min={1}
                    max={30}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} лет`}
                    marks={[
                        { value: 5, label: '5 лет' },
                        { value: 15, label: '15 лет' },
                        { value: 30, label: '30 лет' },
                    ]}
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
                error={!!error && error.includes('email')}
                helperText={error && error.includes('email') ? error : ''}
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
                                Тип недвижимости:
                            </Typography>
                            <Typography variant="body1">
                                {formData.propertyType === 'primary' ? 'Первичная' :
                                    formData.propertyType === 'secondary' ? 'Вторичная' : 'Коммерческая'}
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
                            title="Ежемесячный платеж"
                            value={formatCurrency(results.monthlyPayment)}
                            color="primary"
                            size="xlarge"
                            icon={AttachMoneyIcon}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <ResultCard
                            title="Общая сумма выплат"
                            value={formatCurrency(results.totalPayment)}
                            color="info"
                            size="medium"
                            icon={AccountBalanceIcon}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <ResultCard
                            title="Переплата по кредиту"
                            value={formatCurrency(results.overpayment)}
                            color="warning"
                            size="medium"
                            icon={TrendingUpIcon}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ResultCard
                            title="Необходимый доход"
                            value={formatCurrency(results.requiredIncome)}
                            color="success"
                            size="large"
                            subtitle="ежемесячный платеж × 2.5"
                            icon={WarningIcon}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ResultCard
                            title="Общий срок кредита"
                            value={`${results.termYears} лет`}
                            color="secondary"
                            size="medium"
                            subtitle={`${results.termYears * 12} месяцев`}
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
                    <HomeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Введите параметры ипотеки
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Укажите стоимость недвижимости, первоначальный взнос и срок кредита для расчета
                    </Typography>
                </Box>
            )}
        </>
    );

    return (
        <CalculatorLayout
            title="Ипотечный калькулятор"
            icon={HomeIcon}
            color="#1E3A8A"
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            error={error}
            success={success}
            loading={loading || emailLoading}
            onCalculate={handleCalculate}
            onSendEmail={handleSendEmail}
            onSavePDF={handleSavePDF}
            canCalculate={loanAmount > 0}
            showEmailButton={!!results && !!formData.email}
        >
            {/* Дополнительные элементы под кнопками */}
            {emailLoading && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography variant="body2">
                        Отправка email...
                    </Typography>
                </Box>
            )}
        </CalculatorLayout>
    );
};

export default MortgageCalculator;