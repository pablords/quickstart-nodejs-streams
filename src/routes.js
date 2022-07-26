import express from "express";
import UploadDataController from "./controllers/upload-data.controller.js"


export const router = express.Router()

router.get("/healtz", (_, res) => res.send("ok"))
router.post("/upload", UploadDataController.upload)
router.get("/query-data", UploadDataController.queryCountData)
