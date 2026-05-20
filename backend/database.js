const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        

        db.run(`
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone_number TEXT NOT NULL,
                department TEXT NOT NULL,
                designation TEXT NOT NULL,
                salary REAL NOT NULL,
                joining_date TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);


        db.run(`
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        `, async (err) => {
            if (!err) {

                const defaultUsername = 'admin';
                const defaultPassword = 'password123';
                const hash = await bcrypt.hash(defaultPassword, 10);
                
                db.get(`SELECT * FROM admins WHERE username = ?`, [defaultUsername], (err, row) => {
                    if (!row) {
                        db.run(`INSERT INTO admins (username, password_hash) VALUES (?, ?)`, [defaultUsername, hash], (err) => {
                            if (!err) {
                                console.log('Default admin created (admin / password123)');
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = db;
