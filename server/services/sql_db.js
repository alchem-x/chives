import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import { SQLITE_PATH } from '#server/common/global.js'

export const sqlContext = { db: null }

async function openDB() {
    try {
        console.info('Open SQLite:', SQLITE_PATH)
        sqlContext.db = await open({
            filename: SQLITE_PATH,
            driver: sqlite3.Database,
        })
    } catch (err) {
        console.error(err)
    }
}

if (SQLITE_PATH) {
    await openDB()
}