import { parse } from 'csv'
import fs from "fs"
import { connection } from "./config.js"
import { Worker } from "worker_threads"
import path from 'path'



function createWorker(csvData) {
    const worker = new Worker(path.resolve("src/process-data-mysql/worker.js"), {
        workerData: { data: JSON.stringify(csvData) }
    })
    worker.once('message', (message) => {
        console.log(message)
    })

    worker.on('error', console.error);
    worker.on('exit', code => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
    //console.log(`Iniciando worker de ID ${worker.threadId} e enviando o dado "${JSON.parse(csvData).Region}"`)
    worker.postMessage(JSON.stringify(csvData))

}



function readCsv() {
    const file = path.resolve("data.csv")
    const startTime = new Date()
    console.log("hora do inicio: " + startTime.toLocaleTimeString("pt-br"))
    var csvData = [];
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

            csvData.push(data);
            if (csvData.length == 100) {
                insertDataIntoDb(csvData)
                csvData = []
            }
        })
        .on('end', function () {
            console.log("finished reading process");
        });
}

export function insertDataIntoDb(data) {
    connection.query('INSERT INTO stream SET ?', data, (error, results, fields) => {
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

const execute = () => {
    readCsv()
}

execute()