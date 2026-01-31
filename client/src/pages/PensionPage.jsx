import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';

const PensionPage = () => {
    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                <SavingsIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Калькулятор пенсионных накоплений
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    В разработке
                </Typography>
                <Typography paragraph>
                    Скоро здесь будет доступен калькулятор для планирования пенсионных накоплений
                </Typography>
            </Paper>
        </Container>
    );
};

export default PensionPage;