
import express from "express"
import { router } from "./routes.js"
import cors from "cors"

const server = express()
server.use(cors())
server.use(express.json())
server.use("/", router)

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
});



