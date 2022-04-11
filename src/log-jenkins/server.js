import http from "http"
import { Readable } from "stream"
import axios from "axios"
import fs from "fs"

const getLog = async () => {

    for (var i = 0; i < 10; i++) {
        (async function (i) {
            setTimeout(async function () {
                const { data, status } = await axios.get("http://dev.jenkins.com.br/job/kubeconfig/11/logText/progressiveText?start=0")
                const fileStream = fs.createWriteStream('./log.txt')
                if (status == 200) {
                    fileStream.write(String(data));
                }

            }, 5000 * i);
            // const index = data.search("SUCCESS")
            // if (index) return
        })(i);
    };
}



//function generator a medida que processa retorna para quem chamou
function* run() {
    for (let index = 0; index < 10; index++) {
        const file = fs.readFileSync("./log.txt", { encoding: "utf8" });
        // ele nao aguarda o for terminar. a medida que processa ja passa para frente
        yield file

    }
}

async function handler(req, res) {
    getLog()
    const readable = new Readable({
        read() {
            for (const data of run()) {
                console.log(`sending`, JSON.stringify(data))
                this.push(JSON.stringify(data) + "\n")
            }
            this.push(null)
        }
    })

    readable.pipe(res)
}


http.createServer(handler)
    .listen(3000)
    .on("listening", () => console.log("server ins running at 3000"))