import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CalculatorCard = ({ title, description, icon: Icon, link, color }) => {
    return (
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
            }
        }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon sx={{ fontSize: 40, color: color || 'primary.main', mr: 2 }} />
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>
                </Box>
                <Typography color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button 
                    size="large" 
                    component={RouterLink} 
                    to={link}
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: color || 'primary.main' }}
                >
                    Рассчитать
                </Button>
            </CardActions>
        </Card>
    );
};

export default CalculatorCard;