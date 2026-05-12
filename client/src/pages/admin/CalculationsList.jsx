import React, { useEffect, useState, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
    Pagination, Alert, Box, CircularProgress
} from '@mui/material';
import { adminCalculations } from '../../services/adminApi';

const CalculationsList = () => {
    const [calculations, setCalculations] = useState([]);
    const [filters, setFilters] = useState({ type: '', startDate: '', endDate: '', page: 1 });
    const [pagination, setPagination] = useState({ total: 0, pages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadCalculations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminCalculations.getList(filters);
            setCalculations(res.data.data);
            setPagination(res.data.pagination);
            setError('');
        } catch (err) {
            setError('Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadCalculations();
    }, [loadCalculations]);

    const handleExportCSV = async () => {
        try {
            const res = await adminCalculations.exportCSV();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'calculations.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Ошибка экспорта CSV');
        }
    };

    const handleExportJSON = async () => {
        try {
            const res = await adminCalculations.exportJSON();
            const dataStr = JSON.stringify(res.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'calculations.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError('Ошибка экспорта JSON');
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Тип</InputLabel>
                    <Select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })} label="Тип">
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="mortgage">Ипотека</MenuItem>
                        <MenuItem value="auto">Авто</MenuItem>
                        <MenuItem value="consumer">Потребительский</MenuItem>
                        <MenuItem value="pension">Пенсия</MenuItem>
                    </Select>
                </FormControl>
                <TextField type="date" label="С даты" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value, page: 1 })} InputLabelProps={{ shrink: true }} />
                <TextField type="date" label="По дату" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value, page: 1 })} InputLabelProps={{ shrink: true }} />
                <Button variant="outlined" onClick={handleExportCSV}>Экспорт CSV</Button>
                <Button variant="outlined" onClick={handleExportJSON}>Экспорт JSON</Button>
            </Box>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!loading && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Тип</TableCell><TableCell>Сумма кредита</TableCell><TableCell>Платёж</TableCell><TableCell>Email</TableCell><TableCell>Дата</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {calculations.length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center">Нет данных</TableCell></TableRow>
                            ) : (
                                calculations.map(calc => (
                                    <TableRow key={calc._id}>
                                        <TableCell>{calc.type}</TableCell>
                                        <TableCell>{calc.loanAmount?.toLocaleString() || '-'}</TableCell>
                                        <TableCell>{calc.monthlyPayment?.toLocaleString() || '-'}</TableCell>
                                        <TableCell>{calc.userEmail || '-'}</TableCell>
                                        <TableCell>{new Date(calc.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {pagination.pages > 1 && (
                <Pagination count={pagination.pages} page={filters.page} onChange={(e, p) => setFilters({ ...filters, page: p })} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} />
            )}
        </div>
    );
};

export default CalculationsList;