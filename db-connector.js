var mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'job_board'
});

// check for successful connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to MySQL DB');
        connection.release(); // give connection back to the pool
    }
});

module.exports.pool = pool;
