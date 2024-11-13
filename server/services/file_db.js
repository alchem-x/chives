import { JSONFilePreset } from 'lowdb/node'

export const fileDB = await JSONFilePreset('db.json', {
    watchList: [],
})
