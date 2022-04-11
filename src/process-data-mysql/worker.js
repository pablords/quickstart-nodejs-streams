import { parentPort, workerData } from "worker_threads"
import { parse } from 'csv'
import fs from "fs"
import { connection, pool } from "./config.js"

async function readCsv() {
    const { file } = workerData

    const startTime = new Date()
    console.log("hora do inicio: " + startTime.toLocaleTimeString("pt-br"))
    let csvDataList = [];
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

            csvDataList.push(data);

            if (csvDataList.length == 300) {
                insertDataIntoDb(csvDataList)
                csvDataList = []
            }
        })
        .on('end', function () {
            console.log("finished reading process");
        });

    parentPort.postMessage({ done: true });
}

export function insertDataIntoDb(data) {

    pool.query('INSERT INTO stream SET ?', data, (error, results, fields) => {
        if (error) throw error;
    });

    connection.query('SELECT count(*) FROM stream', (error, results) => {
        if (error) throw error;
        const result = results[0]['count(*)']

        if (result >= 10000) {
            const endTime = new Date()
            console.log("hora do termino: " + endTime.toLocaleTimeString("pt-br"))
            process.exit(1)
        }
    })
}

readCsv()
