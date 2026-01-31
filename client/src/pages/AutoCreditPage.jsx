import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const AutoCreditPage = () => {
    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                <DirectionsCarIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Калькулятор автокредита
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    В разработке
                </Typography>
                <Typography paragraph>
                    Скоро здесь будет доступен калькулятор для расчета автокредита с годовой ставкой 3.5%
                </Typography>
                <Box sx={{ mt: 4, p: 3, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography>
                        <strong>Формула расчета:</strong> аналогична ипотечному калькулятору<br />
                        <strong>Годовая ставка:</strong> 3.5% (из ТЗ)<br />
                        <strong>Расчет:</strong> Сумма кредита = Стоимость авто - Первоначальный взнос
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default AutoCreditPage;