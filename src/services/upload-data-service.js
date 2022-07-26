import path from "path"
import { fileURLToPath } from 'url';
import { isMainThread, Worker, workerData } from "worker_threads"
import express from "express";
import { io } from "../server.js"
import { UploadFile } from "../workers/worker-upload-data.service.js"
import { logger } from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let createWorkerUploadData
if (isMainThread) {
    createWorkerUploadData = (workderDataParams) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: workderDataParams
            })
            worker.on("message", resolve)
            worker.on("error", reject)
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        })
    }
} else {
    // logger.info(workerData)
    const uploadFile = new UploadFile(workerData.socketId)
    uploadFile.registerEvents(workerData.headers)
}