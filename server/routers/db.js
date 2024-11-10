import { Router } from 'express'
import { database } from '../common/database.js'
import { auth } from '../common/auth.js'

export const db = Router()

db.get('/api/db', auth, (req, res) => {
    res.header('Cache-Control', 'no-store')
    res.json(database.data)
})

db.post('/api/db/watch/new', auth, async (req, res) => {
    const item = req.body
    item.id = crypto.randomUUID()
    database.data.watchList.push(item)
    await database.write()
    res.json({ error: '', })
})

db.post('/api/db/watch/update', auth, async (req, res) => {
    const item = req.body
    const findIndex = database.data.watchList.findIndex((it) => it.id === item.id)
    if (findIndex > -1) {
        database.data.watchList.splice(findIndex, 1, item)
        await database.write()
        res.json({ error: '', })
    } else {
        res.send(404, 'NotFound');
    }
})

db.post('/api/db/watch/delete', auth, async (req, res) => {
    const item = req.body
    const findIndex = database.data.watchList.findIndex((it) => it.id === item.id)
    if (findIndex > -1) {
        database.data.watchList.splice(findIndex, 1)
        await database.write()
        res.json({ error: '', })
    } else {
        res.send(404, 'NotFound');
    }
})