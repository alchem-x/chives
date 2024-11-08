import { database } from './database.js'

export function sendBarkNotice(message) {
    const barkAPI = database.data.barkAPI
    if (barkAPI) {
        console.info('Send message:', message)
        const _ = fetch(`${barkAPI}/${message}`)
    }
}