import { getRealtimeStock } from './snowball.js'
import { database } from './database.js'

function sendBarkNotice(barkAPI, message) {
    console.info('Send message:', message)
    const _ = fetch(`${barkAPI}/${message}`)
}

async function pollWatch() {
    while (true) {
        for (const it of database.data.watchList) {
            if (it.enabled) {
                const r = await getRealtimeStock(it.symbol)
                const data = r?.data?.[0]
                if (data) {
                    if ((it.type === 'UP_TO' && data.current >= it.price)) {
                        sendBarkNotice(it.barkAPI, `⏰${it.name ?? ''}${it.symbol}价格涨到${data.current}${it.comment ? `/${it.comment}` : ''}`)
                        it.enabled = false
                        await database.write()
                    }
                    if ((it.type === 'DOWN_TO' && data.current <= it.price)) {
                        sendBarkNotice(it.barkAPI, `⏰${it.name ?? ''}${it.symbol}价格跌到${data.current}${it.comment ? `/${it.comment}` : ''}`)
                        it.enabled = false
                        await database.write()
                    }
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }
}

export function startWatch() {
    const _ = pollWatch()
}
