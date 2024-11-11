import { getKLine } from '../services/snowball.js'

async function main() {
    const r = await getKLine({
        symbol: 'SH000001',
        begin: Date.now(),
        period: 'day',
        type: 'before',
        count: '-10',
        indicator: 'kline',
    })
    const { item } = r.data
    const start = item[0][0]
    const end = item[item.length - 1][0]
    console.log('length', item.length)
    console.log(new Date(start).toLocaleString())
    console.log(new Date(end).toLocaleString())
}

if (process.argv[1] === import.meta.filename) {
    await main()
}
