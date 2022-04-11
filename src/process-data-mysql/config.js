import mysql from "mysql"

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'stream',
    password: 'stream',
    database: 'stream',
    port: 3307,
});

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'stream',
    password: 'stream',
    database: 'stream',
    port: 3307,
    connectionLimit: 500
})

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});