const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken } = require('../middleware/auth');


router.use(verifyToken);


router.post('/', (req, res) => {
    const { employee_id, full_name, email, phone_number, department, designation, salary, joining_date } = req.body;
    

    if (!employee_id || !full_name || !email || !department || !salary) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `
        INSERT INTO employees (employee_id, full_name, email, phone_number, department, designation, salary, joining_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [employee_id, full_name, email, phone_number, department, designation, salary, joining_date];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Employee ID or Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Employee created successfully', id: this.lastID });
    });
});


router.get('/', (req, res) => {
    db.all(`SELECT * FROM employees ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ employees: rows });
    });
});


router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM employees WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ employee: row });
    });
});


router.put('/:id', (req, res) => {
    const { full_name, email, phone_number, department, designation, salary, joining_date } = req.body;

    const sql = `
        UPDATE employees 
        SET full_name = ?, email = ?, phone_number = ?, department = ?, designation = ?, salary = ?, joining_date = ?
        WHERE id = ?
    `;
    const params = [full_name, email, phone_number, department, designation, salary, joining_date, req.params.id];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee updated successfully' });
    });
});


router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM employees WHERE id = ?`, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    });
});

module.exports = router;
