import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Slider,
    Box,
    Grid,
    Button,
    Card,
    CardContent,
    Alert,
    CircularProgress,
} from '@mui/material';
import { calculateMortgage, formatCurrency } from '../utils/calculations';
import SendIcon from '@mui/icons-material/Send';
import CalculateIcon from '@mui/icons-material/Calculate';

const MortgageCalculator = () => {
    const [formData, setFormData] = useState({
        propertyCost: 2000000,
        initialPayment: 500000,
        termYears: 20,
        email: '',
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const annualRate = 9.6; // Ставка из ТЗ

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleSliderChange = (name) => (e, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCalculate = async () => {
        try {
            setLoading(true);
            setError('');

            // Локальный расчет
            const calculation = calculateMortgage(
                formData.propertyCost,
                formData.initialPayment,
                annualRate,
                formData.termYears
            );

            setResults(calculation);

            // Сохранение в базу данных (будет реализовано в бэкенде)
            // const response = await saveCalculation({
            //   ...calculation,
            //   email: formData.email,
            //   type: 'mortgage'
            // });

            setSuccess('Расчет выполнен успешно!');
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

        try {
            setLoading(true);
            // Здесь будет вызов API для отправки email
            // await sendCalculationEmail(results, formData.email);
            setSuccess('Результаты отправлены на email!');
        } catch (err) {
            setError('Ошибка при отправке email: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loanAmount = formData.propertyCost - formData.initialPayment;

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
                    <CalculateIcon sx={{ verticalAlign: 'middle', mr: 2 }} />
                    Ипотечный калькулятор
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <Grid container spacing={4}>
                    {/* Левая колонка - Ввод данных */}
                    <Grid item xs={12} md={6}>
                        <Box component="form" noValidate autoComplete="off">
                            <Typography variant="h6" gutterBottom>
                                Параметры кредита
                            </Typography>

                            <TextField
                                fullWidth
                                label="Стоимость недвижимости, ₽"
                                name="propertyCost"
                                type="number"
                                value={formData.propertyCost}
                                onChange={handleInputChange}
                                margin="normal"
                                InputProps={{
                                    inputProps: { min: 100000, step: 100000 }
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
                                    step={50000}
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
                                />
                            </Box>

                            <TextField
                                fullWidth
                                label="Email для отправки результатов (необязательно)"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                margin="normal"
                                sx={{ mt: 3 }}
                            />

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleCalculate}
                                    disabled={loading || loanAmount <= 0}
                                    startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
                                >
                                    {loading ? 'Расчет...' : 'Рассчитать'}
                                </Button>

                                {results && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={handleSendEmail}
                                        disabled={loading || !formData.email}
                                        startIcon={<SendIcon />}
                                    >
                                        Отправить на email
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Правая колонка - Результаты */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Результаты расчета
                        </Typography>

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
                                            {annualRate}% годовых
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {results && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                                            <CardContent>
                                                <Typography variant="body2">
                                                    Ежемесячный платеж:
                                                </Typography>
                                                <Typography variant="h4">
                                                    {formatCurrency(results.monthlyPayment)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary">
                                                    Общая сумма выплат:
                                                </Typography>
                                                <Typography variant="h6">
                                                    {formatCurrency(results.totalPayment)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary">
                                                    Переплата по кредиту:
                                                </Typography>
                                                <Typography variant="h6" color="error.main">
                                                    {formatCurrency(results.overpayment)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Card sx={{ bgcolor: 'warning.light' }}>
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary">
                                                    Необходимый доход (платеж × 2.5):
                                                </Typography>
                                                <Typography variant="h5">
                                                    {formatCurrency(results.requiredIncome)}
                                                </Typography>
                                                <Typography variant="caption">
                                                    Рекомендуемый минимальный ежемесячный доход
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                                    <Typography variant="body2">
                                        <strong>Расчет выполнен по формулам из ТЗ:</strong><br />
                                        • Ежемесячная ставка: {annualRate}% / 12 / 100 = {results.monthlyRate.toFixed(4)}<br />
                                        • Общая ставка: (1 + {results.monthlyRate.toFixed(4)}) ^ {formData.termYears * 12} = {results.totalRate.toFixed(2)}<br />
                                        • Платеж = {formatCurrency(loanAmount)} × {results.monthlyRate.toFixed(4)} × {results.totalRate.toFixed(2)} / ({results.totalRate.toFixed(2)} - 1)
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default MortgageCalculator;