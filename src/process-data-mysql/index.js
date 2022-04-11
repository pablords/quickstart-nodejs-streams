import { Worker } from "worker_threads"
import path from "path"
import http from "http"



function createWorker(file) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve("src/process-data-mysql/worker.js"), {
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


const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("Hello world!");
};

const execute = () => {
    const file = path.resolve("data.csv")
    createWorker(file)

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

execute()