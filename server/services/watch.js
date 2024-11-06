import { Cron } from 'croner'
import { getRealtimeStock } from './snowball.js'
import { database } from './database.js'
import { sendBarkNotice } from './bark.js'

async function watchStockPrice() {
    console.log('watchStockPrice', new Date())
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
}

export function startWatch() {
    const job = new Cron('*/2 * * * * *', async () => {
        await watchStockPrice()
    })
}
