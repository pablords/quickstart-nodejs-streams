import mysql from "mysql"

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'stream',
    password: 'stream',
    database: 'stream',
    port: 3307,
});

export const poolInsertData = mysql.createPool({
    host: 'localhost',
    user: 'stream',
    password: 'stream',
    database: 'stream',
    port: 3307,
    connectionLimit: 90
})


export const poolCountData = mysql.createPool({
    host: 'localhost',
    user: 'stream',
    password: 'stream',
    database: 'stream',
    port: 3307,
    connectionLimit: 10
})


connection.connect(function (err) {
    if (err) {
        console.error(`error connecting Db: ${err.stack}`);
        return;
    }
    console.log(`Db connected as threadId ${connection.threadId}`);
});
//pool.on('release', () => console.log('pool => conexão retornada'));