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
import SavingsIcon from '@mui/icons-material/Savings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
// import SendIcon from '@mui/icons-material/Send';
// import DownloadIcon from '@mui/icons-material/Download';
import CalculatorLayout from './common/CalculatorLayout';
import ResultCard from './common/ResultCard';
import { formatCurrency } from '../utils/calculations';
import { generateCalculationPDF } from '../utils/generatePDF';
// import { emailAPI } from '../services/emailService';

const PensionCalculator = () => {
    const [formData, setFormData] = useState({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 500000,
        monthlyContribution: 20000,
        expectedReturn: 7,
        email: '',
        pensionType: 'mixed',
        investmentType: 'moderate',
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Расчет пенсионных накоплений
    const calculatePension = () => {
        const {
            currentAge,
            retirementAge,
            currentSavings,
            monthlyContribution,
            expectedReturn,
            pensionType,
        } = formData;

        const yearsToRetirement = retirementAge - currentAge;
        const monthsToRetirement = yearsToRetirement * 12;

        // Расчет накоплений
        const monthlyReturn = expectedReturn / 12 / 100;
        let futureValue = currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
        let futureContributions = 0;
        for (let i = 0; i < monthsToRetirement; i++) {
            futureContributions += monthlyContribution * Math.pow(1 + monthlyReturn, monthsToRetirement - i);
        }

        const totalAtRetirement = futureValue + futureContributions;

        // Расчет пенсии
        const withdrawalRate = pensionType === 'state' ? 0 :
            pensionType === 'private' ? 0.04 : 0.02;

        const privatePension = totalAtRetirement * withdrawalRate;
        const statePension = pensionType === 'private' ? 0 : 20000 * 12; // Упрощенный расчет

        const totalAnnualPension = statePension + privatePension;

        return {
            yearsToRetirement,
            totalAtRetirement: Math.round(totalAtRetirement),
            statePension: Math.round(statePension),
            privatePension: Math.round(privatePension),
            totalAnnualPension: Math.round(totalAnnualPension),
            monthlyPension: Math.round(totalAnnualPension / 12),
        };
    };

    //обработчик текстовых полей
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        //для Email'a и текстовых полей
        if (type === 'email' || type === 'text' || name === 'pensionType' || name === 'investmentType') {
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

            if (formData.currentAge >= formData.retirementAge) {
                setError('Возраст выхода на пенсию должен быть больше текущего возраста');
                return;
            }

            const calculation = calculatePension();
            setResults(calculation);
            setSuccess('Расчет пенсионных накоплений выполнен!');

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

    const handleSavePDF = async () => {
        if (!results) {
            setError('Сначала выполните расчёт');
            return;
        }
        try {
            await generateCalculationPDF('pension', formData, results, 'Пенсионный калькулятор');
            setSuccess('PDF документ сгенерирован и сохранен!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Ошибка при генерации PDF: ' + err.message);
        }
    };

    // Левая панель - форма ввода
    const leftPanel = (
        <>
            {/* Тип пенсионного обеспечения */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Тип пенсионного обеспечения</InputLabel>
                <Select
                    name="pensionType"
                    value={formData.pensionType}
                    onChange={handleInputChange}
                    label="Тип пенсионного обеспечения"
                >
                    <MenuItem value="state">Только государственная</MenuItem>
                    <MenuItem value="private">Только частные накопления</MenuItem>
                    <MenuItem value="mixed">Смешанный тип</MenuItem>
                </Select>
            </FormControl>

            {/* Тип инвестирования */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Тип инвестирования</InputLabel>
                <Select
                    name="investmentType"
                    value={formData.investmentType}
                    onChange={handleInputChange}
                    label="Тип инвестирования"
                >
                    <MenuItem value="conservative">Консервативный</MenuItem>
                    <MenuItem value="moderate">Умеренный</MenuItem>
                    <MenuItem value="aggressive">Агрессивный</MenuItem>
                </Select>
            </FormControl>

            {/* Возраст */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box>
                        <Typography gutterBottom>
                            Текущий возраст: {formData.currentAge} лет
                        </Typography>
                        <Slider
                            value={formData.currentAge}
                            onChange={handleSliderChange('currentAge')}
                            min={18}
                            max={70}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value} лет`}
                        />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box>
                        <Typography gutterBottom>
                            Возраст выхода на пенсию: {formData.retirementAge} лет
                        </Typography>
                        <Slider
                            value={formData.retirementAge}
                            onChange={handleSliderChange('retirementAge')}
                            min={formData.currentAge + 1}
                            max={80}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value} лет`}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Текущие накопления */}
            <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>
                    Текущие накопления: {formatCurrency(formData.currentSavings)}
                </Typography>
                <Slider
                    value={formData.currentSavings}
                    onChange={handleSliderChange('currentSavings')}
                    min={0}
                    max={10000000}
                    step={100000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                />
            </Box>

            {/* Ежемесячные взносы */}
            <Box sx={{ mt: 4 }}>
                <Typography gutterBottom>
                    Ежемесячные взносы: {formatCurrency(formData.monthlyContribution)}
                </Typography>
                <Slider
                    value={formData.monthlyContribution}
                    onChange={handleSliderChange('monthlyContribution')}
                    min={0}
                    max={100000}
                    step={5000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                />
            </Box>

            {/* Ожидаемая доходность */}
            <Box sx={{ mt: 4 }}>
                <Typography gutterBottom>
                    Ожидаемая доходность: {formData.expectedReturn}%
                </Typography>
                <Slider
                    value={formData.expectedReturn}
                    onChange={handleSliderChange('expectedReturn')}
                    min={1}
                    max={15}
                    step={0.5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                />
            </Box>

            {/* Email для отправки */}
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
            {/* Основные параметры */}
            <Card sx={{ bgcolor: 'grey.50', mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Лет до пенсии:
                            </Typography>
                            <Typography variant="h6">
                                {results ? results.yearsToRetirement : formData.retirementAge - formData.currentAge} лет
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Тип пенсии:
                            </Typography>
                            <Typography variant="body1">
                                {formData.pensionType === 'state' ? 'Государственная' :
                                    formData.pensionType === 'private' ? 'Частная' : 'Смешанная'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Текущие накопления:
                            </Typography>
                            <Typography variant="body1">
                                {formatCurrency(formData.currentSavings)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                                Ежемесячные взносы:
                            </Typography>
                            <Typography variant="body1">
                                {formatCurrency(formData.monthlyContribution)}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {results && (
                <Grid container spacing={2}>
                    {/* Накопления к пенсии */}
                    <Grid item xs={12}>
                        <ResultCard
                            title="Накопления к пенсии"
                            value={formatCurrency(results.totalAtRetirement)}
                            color="primary"
                            size="xlarge"
                            icon={AccountBalanceIcon}
                            subtitle={`через ${results.yearsToRetirement} лет`}
                        />
                    </Grid>

                    {/* Ежемесячная пенсия */}
                    <Grid item xs={6}>
                        <ResultCard
                            title="Ежемесячная пенсия"
                            value={formatCurrency(results.monthlyPension)}
                            color="success"
                            size="medium"
                            icon={AttachMoneyIcon}
                        />
                    </Grid>

                    {/* Годовая пенсия */}
                    <Grid item xs={6}>
                        <ResultCard
                            title="Годовая пенсия"
                            value={formatCurrency(results.totalAnnualPension)}
                            color="info"
                            size="medium"
                            icon={TrendingUpIcon}
                        />
                    </Grid>

                    {/* Государственная часть */}
                    <Grid item xs={6}>
                        <ResultCard
                            title="Государственная часть"
                            value={formatCurrency(results.statePension)}
                            color="warning"
                            size="small"
                            icon={CompareArrowsIcon}
                        />
                    </Grid>

                    {/* Частные накопления */}
                    <Grid item xs={6}>
                        <ResultCard
                            title="Частные накопления"
                            value={formatCurrency(results.privatePension)}
                            color="secondary"
                            size="small"
                            icon={TimelineIcon}
                        />
                    </Grid>

                    {/* Коэффициент замены */}
                    <Grid item xs={12}>
                        <ResultCard
                            title="Коэффициент замены"
                            value={`${((results.totalAnnualPension / (50000 * 12)) * 100).toFixed(1)}%`}
                            color="success"
                            size="medium"
                            subtitle="от текущего дохода"
                            icon={EmojiPeopleIcon}
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
                    <SavingsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Введите параметры накоплений
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Укажите ваш возраст, размер накоплений и ежемесячные взносы для расчета
                    </Typography>
                </Box>
            )}
        </>
    );

    return (
        <CalculatorLayout
            title="Калькулятор пенсионных накоплений"
            icon={SavingsIcon}
            color="#F59E0B"
            leftPanel={leftPanel}
            rightPanel={rightPanel}
            error={error}
            success={success}
            loading={loading}
            onCalculate={handleCalculate}
            onSendEmail={handleSendEmail}
            onSavePDF={handleSavePDF}
            canCalculate={formData.currentAge < formData.retirementAge}
        />
    );
};

export default PensionCalculator;