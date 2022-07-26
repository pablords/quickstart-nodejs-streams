'use strict'
import autocannon from "autocannon"

// async/await
async function foo() {
    const result = await autocannon({
        url: 'http://localhost:3001/query-data',
        connections: 500, //default
        pipelining: 1, // default
        duration: 30,
        title: "Teste de carga select database"
    })
    console.log(result)
}

foo()