import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Chip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';

const PortfolioPage = () => {
    const features = [
        { icon: <HomeIcon />, title: 'Ипотечный калькулятор', desc: 'Расчёт с учётом типа жилья и ставки 9.6%' },
        { icon: <DirectionsCarIcon />, title: 'Автокредит', desc: 'Учёт страховки, типа авто, ставка от 3.5%' },
        { icon: <CreditCardIcon />, title: 'Потребительский кредит', desc: 'Любая цель, ставка 14.5%' },
        { icon: <SavingsIcon />, title: 'Пенсионные накопления', desc: 'Прогноз с учётом доходности и инфляции' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1E3A8A', fontWeight: 700 }}>
                Банковский калькулятор
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
                Профессиональные финансовые расчёты за секунды
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SpeedIcon color="primary" /> Быстро и точно
                            </Typography>
                            <Typography>
                                Все расчёты основаны на официальных формулах банков. Результаты – мгновенно, без регистрации.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DevicesIcon color="primary" /> Адаптивный дизайн
                            </Typography>
                            <Typography>
                                Удобно на любом устройстве: компьютере, планшете, смартфоне. Интерфейс подстраивается под экран.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SecurityIcon color="primary" /> Безопасно
                            </Typography>
                            <Typography>
                                Данные не хранятся на сервере (если вы не отправляете отчёт на email). Расчёты приватны.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                📄 Сохранение PDF
                            </Typography>
                            <Typography>
                                Каждый расчёт можно сохранить как PDF-файл или отправить на email в красиво оформленном письме.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h4" sx={{ mt: 6, mb: 3, textAlign: 'center' }}>Калькуляторы</Typography>
            <Grid container spacing={3}>
                {features.map((f, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                            <Box sx={{ fontSize: 40, color: '#1E3A8A', mb: 1 }}>{f.icon}</Box>
                            <Typography variant="h6">{f.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 6, bgcolor: '#f5f7fa', p: 4, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Технологии</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                    {['React', 'Material-UI', 'Node.js', 'Express', 'MongoDB', 'Nodemailer', 'jsPDF'].map(tech => (
                        <Chip key={tech} label={tech} sx={{ m: 0.5 }} />
                    ))}
                </Box>
                <Typography variant="body2" sx={{ mt: 3 }}>
                    © 2026 Банковский калькулятор. Все права защищены.
                </Typography>
            </Box>
        </Container>
    );
};

export default PortfolioPage;