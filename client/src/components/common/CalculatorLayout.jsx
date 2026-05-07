import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    Alert,
    Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import CalculateIcon from '@mui/icons-material/Calculate';

const CalculatorLayout = ({
    title,
    icon: Icon,
    color = '#1E3A8A',
    children,
    leftPanel,
    rightPanel,
    error,
    success,
    loading,
    onCalculate,
    onSendEmail,
    onSavePDF,
    canCalculate = true,
    showEmailButton = true,
}) => {
    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4, color }}>
                    <Icon sx={{ verticalAlign: 'middle', mr: 2 }} />
                    {title}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <Grid container spacing={4}>
                    {/* Левая колонка - Ввод данных */}
                    <Grid item xs={12} md={6}>
                        <Box component="form" noValidate autoComplete="off">
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'secondary.main' }}>
                                Параметры {title.toLowerCase()}
                            </Typography>

                            {leftPanel}

                            <Divider sx={{ my: 3 }} />

                            {/* Кнопки действий */}
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={onCalculate}
                                    disabled={loading || !canCalculate}
                                    startIcon={<CalculateIcon />}
                                    sx={{
                                        flexGrow: 1,
                                        backgroundColor: color,
                                        '&:hover': { backgroundColor: color, opacity: 0.9 }
                                    }}
                                >
                                    {loading ? 'Расчет...' : `Рассчитать ${title.toLowerCase()}`}
                                </Button>

                                {showEmailButton && onSendEmail && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={onSendEmail}
                                        startIcon={<SendIcon />}
                                    >
                                        Отправить
                                    </Button>
                                )}

                                {onSavePDF && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={onSavePDF}
                                        startIcon={<DownloadIcon />}
                                    >
                                        Сохранить PDF
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        {children}
                    </Grid>

                    {/* Правая колонка - Результаты */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'secondary.main' }}>
                            Результаты расчета
                        </Typography>

                        {rightPanel}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CalculatorLayout;