import { Router } from 'express'
import cors from 'cors'
import { auth } from '../common/auth.js'
import { sqlContext } from '../services/sql_db.js'

function dbStatus(req, res, next) {
    if (sqlContext.db) {
        next()
    } else {
        res.json({ error: 'DB Not Found' })
    }
}

async function querySQL(req, res) {
    try {
        const sql = req.body
        const payload = await sqlContext.db.all(sql)
        res.json({ payload })
    } catch (err) {
        res.json({ error: err.message })
    }
}

export const sql = Router()

sql.post('/api/sql', auth, dbStatus, cors(), querySQL)
