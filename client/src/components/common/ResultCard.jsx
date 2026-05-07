import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ResultCard = ({
    title,
    value,
    color = 'primary',
    size = 'medium',
    subtitle,
    icon: Icon
}) => {
    const getTypographyVariant = () => {
        switch (size) {
            case 'small': return 'h6';
            case 'medium': return 'h5';
            case 'large': return 'h4';
            case 'xlarge': return 'h3';
            default: return 'h5';
        }
    };

    return (
        <Card sx={{
            bgcolor: `${color}.light`,
            color: 'white',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
            }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {Icon && <Icon sx={{ mr: 1 }} />}
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant={getTypographyVariant()} sx={{ fontWeight: 'bold' }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 1 }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default ResultCard;