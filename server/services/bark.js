import { BARK_API } from '../common/global.js'

export function sendBarkNotice(message) {
    if (BARK_API) {
        console.info('Send message:', message)
        const _ = fetch(`${BARK_API}/${message}`)
    }
}