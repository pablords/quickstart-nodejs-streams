import { parentPort, workerData } from "worker_threads"
import { parse } from 'csv'
import fs from "fs"
import { poolInsertData, poolCountData } from "../config/db.js"
import { logger } from "../config/logger.js"
import EventEmitter from "events"
import { format, differenceInMinutes, parseISO } from "date-fns"

const eventEmitter = new EventEmitter();

const startTime = format(new Date(), 'HH:mm')

async function readCsv() {
    logger.info("INICIANDO O PROCESSO", { startTime: startTime })
    const { file } = workerData
    let csvDataList = []
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
            csvDataList.push(data)
            if (csvDataList.length == 300) {
                insertDataIntoDb(data)
                csvDataList = []
            }

        })
        .on('end', function () {
            const endTime = format(new Date(), 'HH:mm')
            const finalTime = differenceInMinutes(startTime, endTime)
            eventEmitter.emit('finish', parseISO(finalTime).toISOString());
        });

    parentPort.postMessage({ done: true });
}

function insertDataIntoDb(data) {
    poolInsertData.query('INSERT INTO stream SET ?', data, (error) => { if (error) throw error; });
    querySelectDataCount()
}


function querySelectDataCount() {
    poolCountData.query('SELECT count(*) FROM stream', (error, results) => {
        if (error) throw error;
        const countResult = results[0]['count(*)']
        logger.info(`QUANTIDADE DE LINHAS INSERIDAS ATÉ O MOMENTO: ${countResult}`)
    })
}

eventEmitter.on('finish', endTime => {
    logger.info(`finish ${endTime}`);
    process.exit(1)
});

readCsv()