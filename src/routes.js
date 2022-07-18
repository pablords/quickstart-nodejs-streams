import express from "express";
import ProcessDataController from "./controllers/process-data.controller.js"
import MetricsController from "./controllers/metrics.controller.js"

export const router = express.Router()

router.get("/healtz", (_, res) => res.send("ok"))
router.get('/metrics', MetricsController.getMetrics)
router.get("/upload", ProcessDataController.upload)