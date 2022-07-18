import mysql from "mysql"

export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.DB_PORT,
    connectTimeout: 28800
});

export const poolInsertData = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 90,
    connectTimeout: 28800
})


export const poolCountData = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    connectTimeout: 28800
})


connection.connect(function (err) {
    if (err) {
        console.error(`error connecting Db: ${err.stack}`);
        return;
    }
    console.log(`Db connected as threadId ${connection.threadId}`);
});
//pool.on('release', () => console.log('pool => conexão retornada'));