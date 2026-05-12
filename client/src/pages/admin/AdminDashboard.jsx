import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const AdminDashboard = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card><CardContent><Typography variant="h6">Управление калькуляторами</Typography><Typography>Добавление, редактирование, удаление</Typography></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card><CardContent><Typography variant="h6">Просмотр расчётов</Typography><Typography>Фильтрация, экспорт</Typography></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card><CardContent><Typography variant="h6">Статистика</Typography><Typography>Количество расчётов по типам</Typography></CardContent></Card>
            </Grid>
        </Grid>
    );
};

export default AdminDashboard;