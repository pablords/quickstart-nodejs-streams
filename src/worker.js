import { parentPort, workerData } from "worker_threads"
import { parse } from 'csv'
import fs from "fs"
import { pool, connection } from "./config.js"


async function readCsv() {
    const startTime = new Date()
    console.log(`HORA DO INICIO: ${startTime.toLocaleTimeString("pt-br")}`)
    const { file } = workerData
    fs.createReadStream(file)
        .pipe(parse({ delimiter: ',' }))
        .on('data', function (csvrow) {
            const data = {
                Region: csvrow[0],
                Country: csvrow[1],
                ItemType: csvrow[2],
                SalesChannel: csvrow[3],
                OrderPriority: csvrow[4],
                OrderDate: csvrow[5],
                OrderID: csvrow[6],
                ShipDate: csvrow[7],
                UnitsSold: csvrow[8],
                UnitPrice: csvrow[9],
                UnitCost: csvrow[10],
                TotalRevenue: csvrow[11],
                TotalCost: csvrow[12],
                TotalProfit: csvrow[13]
            }
            insertDataIntoDb(data)
        })
        .on('end', function () {
            console.log("finished reading process");
        });

    parentPort.postMessage({ done: true });
}

function insertDataIntoDb(data) {
    pool.query('INSERT INTO stream SET ?', data, (error) => { if (error) throw error; });
}


setInterval(querySelectDataCount, 5000)
function querySelectDataCount() {
    connection.query('SELECT count(*) FROM stream', (error, results) => {
        if (error) throw error;
        const countResult = results[0]['count(*)']
        console.log(`QUANTIDADE DE LINHAS INSERIDAS ATÉ O MOMENTO: ${countResult}`)
        if (countResult >= 10000) {
            const endTime = new Date()
            console.log(`HORA DO TÉRMINO: ${endTime.toLocaleTimeString("pt-br")}`)
            process.exit(1)
        }
    })
}

readCsv()
