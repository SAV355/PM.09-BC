import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, } from '@mui/material';

const AdminLayout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Админ панель</Typography>
                    <Button color="inherit" component={Link} to="/admin/dashboard">Дашборд</Button>
                    <Button color="inherit" component={Link} to="/admin/calculators">Калькуляторы</Button>
                    <Button color="inherit" component={Link} to="/admin/calculations">Расчеты</Button>
                    <Button color="inherit" onClick={handleLogout}>Выйти</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Outlet />
            </Container>
        </>
    );
};

export default AdminLayout;