import { Router } from 'express'
import { auth } from '#server/common/auth.js'
import { fileDB } from '#server/services/file_db.js'

export const db = Router()

db.get('/api/db', auth, (req, res) => {
    res.header('Cache-Control', 'no-store')
    res.json(fileDB.data)
})

db.post('/api/db/watch/new', auth, async (req, res) => {
    const item = req.body
    item.id = crypto.randomUUID()
    fileDB.data.watchList.push(item)
    await fileDB.write()
    res.json({ error: '', })
})

db.post('/api/db/watch/update', auth, async (req, res) => {
    const item = req.body
    const findIndex = fileDB.data.watchList.findIndex((it) => it.id === item.id)
    if (findIndex > -1) {
        fileDB.data.watchList.splice(findIndex, 1, item)
        await fileDB.write()
        res.json({ error: '', })
    } else {
        res.send(404, 'NotFound');
    }
})

db.post('/api/db/watch/delete', auth, async (req, res) => {
    const item = req.body
    const findIndex = fileDB.data.watchList.findIndex((it) => it.id === item.id)
    if (findIndex > -1) {
        fileDB.data.watchList.splice(findIndex, 1)
        await fileDB.write()
        res.json({ error: '', })
    } else {
        res.send(404, 'NotFound');
    }
})