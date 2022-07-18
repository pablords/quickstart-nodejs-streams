import { createWorker } from "../services/process-data.service.js"
import path from "path"

const file = path.resolve("data.csv")

class ProcessData {
    
    async upload(req, res) {
        createWorker(file)
        res.send("ok")
    }
}

export default new ProcessData()