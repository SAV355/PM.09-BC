import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './';
import HomePage from './';
import MortgagePage from './';
import AutoCreditPage from './';
import PensionPage from './';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1E3A8A', // Корпоративный синий
        },
        secondary: {
            main: '#10B981', // Корпоративный зеленый
        },
        background: {
            default: '#F9FAFB',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                                <div className="App">
                    <Header />
                    <main style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/mortgage" element={<MortgagePage />} />
                            <Route path="/auto-credit" element={<AutoCreditPage />} />
                            <Route path="/pension" element={<PensionPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
