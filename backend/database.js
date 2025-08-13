const mysql = require('mysql2/promise');

// Check for required environment variables before proceeding.
// This provides a clear error if the .env file is missing or incomplete.
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'API_KEY'];
for (const v of requiredEnvVars) {
    if (!process.env[v]) {
        console.error(`
======================================================================
FATAL ERROR: Environment variable ${v} is not set.

Please ensure you have a '.env' file in the 'backend' directory
with all the required values.

Example .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=finance_flow
JWT_SECRET=a_long_random_secret_string_for_security
API_KEY=your_google_ai_studio_api_key_here

See README.md for more details.
======================================================================
`);
        process.exit(1); // Stop the server from starting
    }
}


// It's highly recommended to use environment variables for configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const tableCreationQueries = [
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        type ENUM('income', 'expense') NOT NULL,
        category VARCHAR(255) NOT NULL,
        member VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS family_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        targetAmount DECIMAL(10, 2) NOT NULL,
        currentAmount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS recurring_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        dueDay INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS investments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        quantity DECIMAL(10, 4),
        purchasePrice DECIMAL(10, 2),
        currentValue DECIMAL(10, 2),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS debts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        totalAmount DECIMAL(10, 2) NOT NULL,
        amountPaid DECIMAL(10, 2) NOT NULL,
        interestRate DECIMAL(5, 2),
        minPayment DECIMAL(10, 2),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
];

const initDB = async () => {
    try {
        console.log('Connecting to database...');
        const connection = await pool.getConnection();
        console.log('Database connected successfully.');

        console.log('Checking and creating tables...');
        for (const query of tableCreationQueries) {
            await connection.query(query);
        }
        console.log('All tables are ready.');
        
        connection.release();
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
        console.error("\nHint: Please ensure your MySQL server is running and the database credentials in 'backend/.env' are correct.");
        // Exit process if DB connection fails, as the app can't run without it
        process.exit(1);
    }
};

module.exports = {
    pool,
    initDB
};