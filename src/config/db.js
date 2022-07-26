import mysql from "mysql"
import { promisify } from "node:util"
import { logger } from "./logger.js"
import os from "os"



const numCPUS = os.cpus().length

const poollist = []
for (let index = 0; index < numCPUS; index++) {
    poollist.push(mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.DB_PORT,
        connectionLimit: 20,
        connectTimeout: 28800
    }))
}

export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.DB_PORT,
    connectTimeout: 28800
});

poollist.map((pool, index) => {
    pool.getConnection((err, connection) => {
        if (err)
            logger.error(`error connecting Db: ${err.stack}`);
        if (connection)
            connection.release();
        logger.info(`Pool ${index} connected as threadId ${connection.threadId}`);
    });
})

connection.connect(function (err) {
    if (err) {
        logger.error(`error connecting Db: ${err.stack}`);
        return;
    }
    logger.info(`Db connection connected as threadId ${connection.threadId}`);
});


export const pools = poollist
connection.query = promisify(connection.query)