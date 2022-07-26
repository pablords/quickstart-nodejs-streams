
import 'dotenv/config'
import express from "express"
import { router } from "./routes.js"
import cors from "cors"
import MetricsController from "./controllers/metrics.controller.js"
import os from "os"
import cluster from "cluster"
import { logger } from "./config/logger.js"
import http from "http"



const numCPUS = os.cpus().length

if (cluster.isMaster) {
    for (let i = 0; i < numCPUS; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        logger.error(`worker ${worker.process.pid} died`);
    });
    logger.info(`Master ${process.pid} is running`);
} else {
    const app = express()
    const server = http.createServer(app);
    app.use(cors())
    app.use(express.json())
    app.use("/", router)
    app.use("/metrics", MetricsController.getMetrics)
    server.listen(process.env.PORT, () => {
        logger.info(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
    });
    logger.info(`Worker ${process.pid} started`);
}

