import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import HomeIcon from '@mui/icons-material/Home';

const Header = () => {
    return (
        <AppBar position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <CalculateIcon sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        Банковский калькулятор
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/"
                            startIcon={<HomeIcon />}
                        >
                            Главная
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/mortgage"
                        >
                            Ипотека
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/auto-credit"
                        >
                            Автокредит
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/pension"
                        >
                            Пенсионные накопления
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;