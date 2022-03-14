import http from "http"
import { Readable } from "stream"
import { randomUUID } from "crypto"

//function generator a medida que processa retorna para quem chamou

function* run() {
    
    for (let index = 0; index < 99; index++) {
        
        const data = {
            id: randomUUID(),
            name: `Pablo-${index}`
        }

        setTimeout(() => {
            console.log(data);
          }, 1000 * index);
        // ele nao aguarda o for terminar. a medida que processa ja passa para frente
        yield data

    }
}

async function handler(req, res) {
    const readable = new Readable({
        read() {
            for (const data of run()) {
                console.log(`sending`, data)
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