
import { Worker } from "worker_threads"
import path from "path"
import { logger } from "../config/logger.js"

export async function createWorkerUploadDataDownloads(file) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve("src/workers/worker-upload-data-downloads.service.js"), {
            workerData: { file: file }
        })
        logger.info(`Executando ${worker.threadId}`)
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", code => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}