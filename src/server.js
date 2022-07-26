
import 'dotenv/config'
import express from "express"
import { router } from "./routes.js"
import cors from "cors"
import MetricsController from "./controllers/metrics.controller.js"
import { logger } from "./config/logger.js"
import { Server } from "socket.io"
import http from "http"


const app = express()
const server = http.createServer(app);
app.use(cors())
app.use(express.json())


export const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: false,
    },
});

io.on('connection', (socket) => {
    logger.info(`a user connected ${socket.id}`);
    socket.on('disconnect', () => {
        logger.info(`user disconnected ${socket.id}`);
    });
});
app.use("/", router)
app.use("/metrics", MetricsController.getMetrics)
server.listen(process.env.PORT, () => {
    logger.info(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
});






