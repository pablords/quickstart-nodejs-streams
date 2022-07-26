
import { queryCountDataService } from "../services/query-data.service.js"
import url from "url"
import { io } from "../server.js"
import { UploadFile } from "../workers/worker-upload-data.service.js"



class UploadDataController {

    async upload(req) {
        const { query: { socketId } } = url.parse(req.url, true)
        const uploadFile = new UploadFile(io, socketId)
        uploadFile.registerEvents(req)
    }

    async queryCountData(req, res) {
        const data = await queryCountDataService()
        return res.json(data)
    }
}

export default new UploadDataController()