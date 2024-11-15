import { Cron } from 'croner'
import { getStock } from '#server/services/snowball.js'
import { NOCODB_TABLE_STOCK } from '#server/common/global.js'
import { getTableData, updateTableData } from '#server/services/nocodb.js'

function formatDate(date) {
    return new Date(date).toLocaleDateString().replace(/\//g, '-')
}

async function syncStockData(tableId) {
    try {
        console.info(new Date().toLocaleString(), '-', 'Start SyncStockData Job')
        for (let i = 0; ; i += 1000) {
            const d = await getTableData({ offset: 0 + i, limit: 1000, tableId })
            const list = d?.list
            if (list?.length) {
                for (const it of list) {
                    const { data } = await getStock(it.symbol)
                    if (data && data.quote) {
                        const quote = data.quote
                        it.name = quote.name
                        it.date = new Date(quote.timestamp).toISOString()
                        it.open = quote.open
                        it.current = quote.current
                        it.last_close = quote.last_close
                        it.low = quote.low
                        it.high = quote.high
                        it.change = quote.chg
                        it.percent = quote.percent
                        it.volume = quote.volume
                        it.amount = quote.amount
                        it.turnover_rate = quote.turnover_rate
                        console.debug(formatDate(it.date), it.symbol, it.name, it.current)
                    }
                    delete it.CreatedAt
                    delete it.UpdatedAt
                    await new Promise((resolve) => setTimeout(resolve, 100))
                }
                await updateTableData({ list, tableId })
            } else {
                break
            }
        }
    } catch (err) {
        console.error(err)
    }
}

export const stockJobs = []

export function startStockJobs() {
    if (NOCODB_TABLE_STOCK) {
        stockJobs.push(...[
            new Cron('0 30 15 * * *', { name: 'SyncStockData', timezone: 'Asia/Shanghai' }, () => syncStockData(NOCODB_TABLE_STOCK)),
        ])
        console.info('Start cron job(s):', stockJobs.map((it) => it.name))
    }
}

if (process.argv[1] === import.meta.filename) {
    await syncStockData(NOCODB_TABLE_STOCK)
}
