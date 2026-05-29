import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import CalculatorCard from '../components/CalculatorCard';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';

const HomePage = () => {
    const calculators = [
        {
            title: 'Ипотечный калькулятор',
            description: 'Рассчитайте ежемесячный платеж по ипотеке, переплату и необходимый доход. Годовая ставка: 9.6%',
            icon: HomeIcon,
            link: '/mortgage',
            color: '#1E3A8A',
        },
        {
            title: 'Калькулятор автокредита',
            description: 'Расчет кредита на автомобиль с учетом первоначального взноса. Годовая ставка: 3.5%',
            icon: DirectionsCarIcon,
            link: '/auto-credit',
            color: '#10B981',
        },
        {
            title: 'Потребительский кредит',
            description: 'Расчет кредита наличными для любых целей. Годовая ставка: 14.5%',
            icon: AccountBalanceIcon,
            link: '/consumer-credit',
            color: '#8B5CF6',
        },
        {
            title: 'Пенсионные накопления',
            description: 'Расчет будущих пенсионных накоплений и планирование выплат',
            icon: SavingsIcon,
            link: '/pension',
            color: '#F59E0B',
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', my: 6 }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Банковский калькулятор
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Произведите расчеты по различным финансовым продуктам нашего банка
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {calculators.map((calc, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <CalculatorCard {...calc} />
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 8, p: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Как пользоваться калькулятором?
                </Typography>
                <Typography paragraph>
                    1. Выберите нужный тип калькулятора<br />
                    2. Введите параметры кредита (сумма, срок, первоначальный взнос)<br />
                    3. Нажмите "Рассчитать" для получения результатов<br />
                    4. Сохраните или отправьте результаты на email
                </Typography>
            </Box>
        </Container>
    );
};

export default HomePage;