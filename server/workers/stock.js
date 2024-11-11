import { getKLine } from '../services/snowball.js'

async function main() {
    const d = await getKLine({
        symbol: 'SH000001',
        begin: Date.now(),
        period: 'day',
        type: 'before',
        count: '-10000',
        indicator: 'kline',
    })
    const { item } = d.data
    console.log('length', item.length)
    const start = item[0][0]
    const end = item[item.length - 1][0]
    console.log(new Date(start).toLocaleString())
    console.log(new Date(end).toLocaleString())
}

// await main()