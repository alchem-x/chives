import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Router } from 'express'
import cors from 'cors'
import { SQLITE_PATH } from '../common/global.js'
import { auth } from '../common/auth.js'

export const sql = Router()

const sqlContext = { db: null }

if (SQLITE_PATH) {
    sqlContext.db = await open({
        filename: SQLITE_PATH,
        driver: sqlite3.Database
    })
}

sql.post('/api/sql', auth, cors(), async (req, res) => {
    if (sqlContext.db) {
        try {
            const sql = req.body
            const payload = await db.all(sql)
            res.json({ payload })
        } catch (err) {
            res.json({ error: err.message })
        }
    } else {
        res.json({ error: 'DB Not Found' })
    }
})

