# Modern User Authentication System

A complete, professional, and stylish user authentication system built with PHP, MySQL, HTML, CSS (Glassmorphism), JavaScript, and Bootstrap 5.

## Features

- **Modern UI/UX**: Dark purple/blue gradient backgrounds, animated floating shapes, and glassmorphism styling.
- **Secure Authentication**: Uses `password_hash()` and `password_verify()` for secure password storage.
- **Protected Routes**: Dashboard is an exclusive protected route inaccessible without active session.
- **Client &    Server Validation**: Robust form validations on both ends.
- **Real-time Password Strength**: Visual strength indicator.
- **Responsive Design**: Flawless layout on desktop and mobile.

## Prerequisites

- Local Server Environment (XAMPP, WAMP, Laragon, etc.) running Apache and MySQL.
- PHP 8.x +
- PDO extension enabled.

## Setup Instructions

1. **Move to Server:** Ensure this project folder (`auth_system`) is placed inside your server's web root (e.g., `htdocs` for XAMPP or `www` for WAMP).
2. **Database Setup:** 
   - Open your MySQL panel (e.g., phpMyAdmin).
   - Create a database named `auth_system` (or just import the file directly as the SQL script handles DB creation).
   - Import the `database.sql` file provided to create the `users` table.
3. **Configure Connection:** If your MySQL setup uses a different username/password than 'root'/'empty', open `db.php` and update the credentials.
4. **Run:** Open your browser and navigate to `http://localhost/auth_system/`.

## Architecture Note

* `index.php`: Smart router checking if a user is logged in.
* `register.php`: New account creation handled securely using Prepared Statements.
* `login.php`: Authenticates returning users.
* `dashboard.php`: Restricted area displaying user session info.
* `logout.php`: Clears all traces of the current session safely.

## Important Security Notes

- This project is meant for educational and portfolio purposes, demonstrating modern coding approaches.
- Prepared SQL statements are used to protect against SQL injections.
- Cross-Site Scripting (XSS) is minimized via `htmlspecialchars()` usage for output display.
