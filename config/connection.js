// Requiring packages
const mysql = require('mysql');
const util = require('util');
const { allowedNodeEnvironmentFlags } = require('process');

// Connect to MySQL Database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'yourRootPassword',
        database: 'employee_DB',
    }
);

connection.connect((err) => {
    if (err) throw err;
});

const query = util.promisify(connection.query).bind(connection);

module.exports = connection;