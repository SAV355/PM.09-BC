const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
        res.json({ success: true, token: process.env.ADMIN_TOKEN || 'secure_admin_token_123'});
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
}); 

module.exports = router;