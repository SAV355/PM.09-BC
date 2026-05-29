import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, FormControlLabel, Switch, IconButton, Alert,
    Grid, Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { adminCalculators } from '../../services/adminApi';

const CalculatorManager = () => {
    const [calculators, setCalculators] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        name: '', type: 'mortgage', displayName: '', description: '', icon: '', color: '#1E3A8A',
        isActive: true, fields: [], rates: { baseRate: 0, adjustments: [] }, extraParams: {}, order: 0
    });
    const [error, setError] = useState('');

    const loadCalculators = async () => {
        try {
            const res = await adminCalculators.getAll();
            setCalculators(res.data);
        } catch (err) {
            setError('Ошибка загрузки');
        }
    };

    useEffect(() => { loadCalculators(); }, []);

    const handleOpen = (calc = null) => {
        if (calc) {
            setEditing(calc._id);
            setFormData(calc);
        } else {
            setEditing(null);
            setFormData({ name: '', type: 'mortgage', displayName: '', description: '', icon: '', color: '#1E3A8A', isActive: true, fields: [], rates: { baseRate: 0, adjustments: [] }, extraParams: {}, order: 0 });
        }
        setOpen(true);
    };

    const handleClose = () => { setOpen(false); setEditing(null); setError(''); };

    const handleSave = async () => {
        try {
            if (editing) {
                await adminCalculators.update(editing, formData);
            } else {
                await adminCalculators.create(formData);
            }
            loadCalculators();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить калькулятор?')) {
            await adminCalculators.delete(id);
            loadCalculators();
        }
    };

    return (
        <div>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>Добавить калькулятор</Button>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell><TableCell>Тип</TableCell><TableCell>Активен</TableCell><TableCell>Порядок</TableCell><TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calculators.map(calc => (
                            <TableRow key={calc._id}>
                                <TableCell>{calc.displayName}</TableCell><TableCell>{calc.type}</TableCell>
                                <TableCell>{calc.isActive ? 'Да' : 'Нет'}</TableCell><TableCell>{calc.order}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(calc)}><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(calc._id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{editing ? 'Редактировать калькулятор' : 'Новый калькулятор'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}><TextField label="Уникальное имя (slug)" fullWidth value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></Grid>
                        <Grid item xs={6}><TextField label="Отображаемое имя" fullWidth value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} required /></Grid>
                        <Grid item xs={12}><TextField label="Описание" fullWidth multiline rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></Grid>
                        <Grid item xs={6}><TextField label="Иконка (MUI имя)" fullWidth value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} /></Grid>
                        <Grid item xs={6}><TextField label="Цвет" fullWidth value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} /></Grid>
                        <Grid item xs={3}><FormControlLabel control={<Switch checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />} label="Активен" /></Grid>
                        <Grid item xs={3}><TextField label="Порядок" type="number" fullWidth value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} /></Grid>
                        <Grid item xs={6}><TextField label="Базовая ставка (%)" type="number" fullWidth value={formData.rates.baseRate} onChange={e => setFormData({ ...formData, rates: { ...formData.rates, baseRate: parseFloat(e.target.value) } })} /></Grid>
                    </Grid>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Поля формы (JSON)</Typography>
                    <TextField fullWidth multiline rows={4} value={JSON.stringify(formData.fields, null, 2)} onChange={e => setFormData({ ...formData, fields: JSON.parse(e.target.value) })} helperText="Введите JSON массив полей" />
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Дополнительные параметры (JSON)</Typography>
                    <TextField fullWidth multiline rows={2} value={JSON.stringify(formData.extraParams, null, 2)} onChange={e => setFormData({ ...formData, extraParams: JSON.parse(e.target.value) })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={handleSave} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalculatorManager;