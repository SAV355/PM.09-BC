import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Импорт компонентов
import GoogleAnalytics from './components/GoogleAnalytics';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MortgagePage from './pages/MortgagePage';
import AutoCreditPage from './pages/AutoCreditPage';
import ConsumerCreditPage from './pages/ConsumerCreditPage';
import PensionPage from './pages/PensionPage';
import PortfolioPage from './pages/PortfolioPage';
// Импорт Админа 
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CalculatorManager from './pages/admin/CalculatorManager';
import CalculationsList from './pages/admin/CalculationsList';

const theme = createTheme({
    palette: {
        primary: { main: '#1E3A8A' },
        secondary: { main: '#10B981' },
        info: { main: '#0EA5E9' },
        success: { main: '#10B981' },
        warning: { main: '#F59E0B' },
        error: { main: '#EF4444' },
        background: { default: '#F9FAFB' },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <GoogleAnalytics />
                <div className="App">
                    <Header />
                    <Routes>
                        {/* Основные маршруты */}
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/mortgage" element={<MortgagePage />} />
                        <Route path="/auto-credit" element={<AutoCreditPage />} />
                        <Route path="/consumer-credit" element={<ConsumerCreditPage />} />
                        <Route path="/pension" element={<PensionPage />} />
                        
{/* Админка — маршруты из-под Header*/}
                        {/* Маршрутизация логина */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="/admin/dashboard" />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="calculators" element={<CalculatorManager />} />
                            <Route path="calculations" element={<CalculationsList />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;