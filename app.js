
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/ticker', async (req, res) => {
    const { ticker, column, period } = req.query;
    const columnsToQuery = column ? column.split(',').join(', ') : '*';
    console.log(ticker, column, period);
    
    let query = `SELECT ${columnsToQuery} FROM sample_data_historic__1_ WHERE ticker = ?`;
    let queryParams = [ticker];
    if (period === '5y') {
        query += " AND STR_TO_DATE(date, '%m/%d/%Y') >= CURDATE() - INTERVAL 5 YEAR";
    }

    try {
        const [rows] = await pool.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Query error: ', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

