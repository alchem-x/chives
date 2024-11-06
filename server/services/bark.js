
export function sendBarkNotice(barkAPI, message) {
    console.info('Send message:', message)
    const _ = fetch(`${barkAPI}/${message}`)
}