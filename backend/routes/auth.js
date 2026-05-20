const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { JWT_SECRET } = require('../middleware/auth');


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get(`SELECT * FROM admins WHERE username = ?`, [username], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (!row) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, row.password_hash);
        
        if (!match) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ message: 'Login successful', token });
    });
});

module.exports = router;
