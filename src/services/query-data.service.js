import { pools } from "../config/db.js"
import { promisify } from "node:util"

export async function queryCountDataService() {
    const poolNumber = Math.floor(Math.random() * pools.length)
    const pool = pools[poolNumber]
    pool.query = promisify(pool.query)
    const res = await pool.query('SELECT count(*) FROM stream')
    return res[0]['count(*)']
    //return res[0]['count(*)']
    // Promise.all(pools.map(async (pool, index) => {
    //     pool.query = promisify(pool.query)
    //     const res = await pool.query('SELECT count(*) FROM stream')
    //     console.log(res)
    //     console.log(index)
    //     data = res[0]['count(*)']
    // }))
    // console.log(data)
    // return data
}