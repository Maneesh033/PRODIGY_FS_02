const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./database');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
