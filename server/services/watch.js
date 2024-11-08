import { Cron } from 'croner'
import { getRealtimeStock, getStock } from './snowball.js'
import { database } from './database.js'
import { sendBarkNotice } from './bark.js'

export const watchJobs = []

async function watchStockPrice() {
    for (const it of database.data.watchList) {
        if (it.enabled && it.marketStatus === '交易中') {
            const r = await getRealtimeStock(it.symbol)
            const data = r?.data?.[0]
            if (data) {
                it.current = data.current
                if ((it.type === 'UP_TO' && it.current >= it.price)) {
                    sendBarkNotice(`⏰${it.name ?? ''}${it.symbol}价格涨到${it.current}${it.comment ? `/${it.comment}` : ''}`)
                    it.enabled = false
                }
                if ((it.type === 'DOWN_TO' && it.current <= it.price)) {
                    sendBarkNotice(`⏰${it.name ?? ''}${it.symbol}价格跌到${it.current}${it.comment ? `/${it.comment}` : ''}`)
                    it.enabled = false
                }
            }
        }
    }
    await database.write()
}

async function watchStock() {
    for (const it of database.data.watchList) {
        const r = await getStock(it.symbol)
        const data = r?.data
        if (data) {
            it.marketStatus = data.market.status
            it.current = data.quote.current
        }
    }
    await database.write()
}

export function startWatch() {
    watchJobs.push(...[
        new Cron('*/2 * * * * *', { name: 'WatchStockPrice', }, watchStockPrice),
        new Cron('0 * * * * *', { name: 'WatchStock', }, watchStock)
    ])
}
