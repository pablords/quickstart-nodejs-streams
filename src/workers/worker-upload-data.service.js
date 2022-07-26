import busboy from "busboy";
import { logger } from "../config/logger.js"
import { pipelineAsync } from "../utils.js"
import { Writable, Transform, Readable } from "stream"
import { pools } from "../config/db.js"
import csvtoJson from "csvtojson"
import { promisify } from "util"
import fs from "fs"
import path from "path";
import { randomUUID } from "crypto"


const FILE_EVENT_NAME = "file-uploaded"

export class UploadFile {

    #io
    #socketId

    constructor(io, socketId) {
        this.#io = io
        this.#socketId = socketId
    }

    registerEvents(req) {
        const bb = busboy({ headers: req.headers });
        bb.on('file', this.#onFile.bind(this));
        req.pipe(bb)
    }

    #handleFileBytes(info) {
        async function* handleData(data) {
            for await (const item of data) {
                const size = item.length
                //logger.info(`File [${info.filename}] got ${size} lines to ${this.#socketId}`)
                this.#io.to(this.#socketId).emit(FILE_EVENT_NAME, size)
                yield item
            }
        }
        return handleData.bind(this)
    }


    #updateKeys() {
        return new Transform({
            transform(chunk, econding, cb) {
                const parse = JSON.parse(chunk)
                const data = {
                    Region: parse.Region,
                    Country: parse.Country,
                    ItemType: parse["Item Type"],
                    SalesChannel: parse["Sales Channel"],
                    OrderPriority: parse["Order Priority"],
                    OrderDate: parse["Order Date"],
                    OrderID: parse["Order ID"],
                    ShipDate: parse["Ship Date"],
                    UnitsSold: parse["Units Sold"],
                    UnitPrice: parse["Unit Price"],
                    UnitCost: parse["Unit Cost"],
                    TotalRevenue: parse["Total Revenue"],
                    TotalCost: parse["Total Cost"],
                    TotalProfit: parse["Total Profit"]
                }
                cb(null, JSON.stringify(data))
            }
        })
    }

    #writeOnFile() {
        return new Writable({
            write(chunk, encoding, cb) {
                UploadFile.insertDataIntoDb(chunk)
                cb()
            }
        })
    }

    static async insertDataIntoDb(row) {
        const data = JSON.parse(row)
        const poolNumber = Math.floor(Math.random() * pools.length)
        const pool = pools[poolNumber]
        pool.query = promisify(pool.query)
        await pool.query('INSERT INTO stream SET ?', data)
    }


    async #onFile(name, file, info) {
        logger.info('Uploading:');
        await pipelineAsync(
            file,
            this.#handleFileBytes.apply(this, [info]),
            csvtoJson(),
            this.#updateKeys.apply(),
            this.#writeOnFile.apply()
        )
        logger.info(`File [${name}] Finished`)
    }
}