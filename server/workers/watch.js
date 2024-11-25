import { Cron } from 'croner'
import { getRealtimeStock, getStock } from '#server/services/snowball.js'
import { sendBarkNotice } from '#server/services/bark.js'
import { isNumeric } from '#server/common/utils.js'
import { SNOWBALL_TOKEN } from '#server/common/global.js'
import { fileDB } from '#server/services/file_db.js'

export const watchJobs = []

const WATCH_TYPE = {
    UP_TO: 'UP_TO',
    DOWN_TO: 'DOWN_TO',
}

async function watchStockPrice() {
    console.info(new Date().toLocaleString(), '-', 'Run WatchStockPrice Job')
    for (const it of fileDB.data.watchList) {
        function sendPriceChangeNotice(label) {
            const stockName = it.name ? it.name : it.symbol
            const comment = it.comment ? `/${it.comment}` : ''
            sendBarkNotice(`${label}${stockName}: ${it.current}${comment}`)
        }
        if (it.enabled && it.marketStatus === '交易中') {
            const r = await getRealtimeStock(it.symbol)
            const data = r?.data?.[0]
            if (data) {
                it.current = data.current
                if (it.type === WATCH_TYPE.UP_TO) {
                    if (isNumeric(it.value) && it.current >= parseFloat(it.value)) {
                        sendPriceChangeNotice('📈')
                        it.enabled = false
                    }
                }
                if (it.type === WATCH_TYPE.DOWN_TO) {
                    if (isNumeric(it.value) && it.current <= parseFloat(it.value)) {
                        sendPriceChangeNotice('📉')
                        it.enabled = false
                    }
                }
            }
        }
    }
    await fileDB.write()
}

async function watchStock() {
    for (const it of fileDB.data.watchList) {
        const r = await getStock(it.symbol)
        const data = r?.data
        if (data) {
            it.marketStatus = data.market.status
            it.current = data.quote.current
        }
    }
    await fileDB.write()
}

export function startWatchJobs() {
    if (SNOWBALL_TOKEN) {
        watchJobs.push(...[
            new Cron('*/2 * * * * *', { name: 'WatchStockPrice', }, watchStockPrice),
            new Cron('0 * * * * *', { name: 'WatchStock', }, watchStock)
        ])
        console.info('Start cron job(s):', watchJobs.map((it) => it.name))
    }
}
