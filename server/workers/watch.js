import { Cron } from 'croner'
import { getRealtimeStock, getStock } from '../services/snowball.js'
import { database } from '../common/database.js'
import { sendBarkNotice } from '../services/bark.js'
import { isNumeric } from '../common/utils.js'

export const watchJobs = []

const WATCH_TYPE = {
    UP_TO: 'UP_TO',
    DOWN_TO: 'DOWN_TO',
}

async function watchStockPrice() {
    for (const it of database.data.watchList) {
        if (it.enabled && it.marketStatus === '交易中') {
            const r = await getRealtimeStock(it.symbol)
            const data = r?.data?.[0]
            if (data) {
                it.current = data.current
                if (it.type === WATCH_TYPE.UP_TO) {
                    if (isNumeric(it.value) && it.current >= parseFloat(it.value)) {
                        sendBarkNotice(`⏰${it.name ?? ''}${it.symbol}价格涨到${it.current}${it.comment ? `/${it.comment}` : ''}`)
                        it.enabled = false
                    }
                }
                if (it.type === WATCH_TYPE.DOWN_TO) {
                    if (isNumeric(it.value) && it.current <= parseFloat(it.value)) {
                        sendBarkNotice(`⏰${it.name ?? ''}${it.symbol}价格跌到${it.current}${it.comment ? `/${it.comment}` : ''}`)
                        it.enabled = false
                    }
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
