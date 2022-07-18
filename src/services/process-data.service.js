
import { Worker } from "worker_threads"
import path from "path"

export async function createWorker(file) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve("src/services/worker.js"), {
            workerData: { file: file }
        })
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", code => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });

}