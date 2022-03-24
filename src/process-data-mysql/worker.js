import { parentPort, workerData } from "worker_threads"
import { insertDataIntoDb } from "./index.js"

parentPort.once('message', (message) => {
    insertDataIntoDb(message)
    parentPort.postMessage(message);
});

