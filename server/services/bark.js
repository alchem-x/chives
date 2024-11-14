import { BARK_API } from '#server/common/global.js'

export function sendBarkNotice(message) {
    if (BARK_API) {
        console.info('Send message:', message)
        return fetch(`${BARK_API}/${message}`)
    } else {
        console.warn('NO BARK API')
    }
}