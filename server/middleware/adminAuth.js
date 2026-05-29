const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secure_admin_token_123';

const adminAuth = (req, res, next) => {
    const token = req.headers['x-admin-token'];
    if (!token || token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

module.exports = adminAuth;