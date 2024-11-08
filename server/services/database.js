import { JSONFilePreset } from 'lowdb/node'

export const database = await JSONFilePreset('db.json', {
    barkAPI: '',
    watchList: [],
})
