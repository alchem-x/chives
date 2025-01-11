import { getKLine } from '#server/services/snowball.js'
import dayjs from 'dayjs'

// SH:588000

function getItem(it) {
    const [
        timestamp, volume,
        open, high,
        low, close,
        chg, percent,
        turnoverrate, amount,
        volume_post, amount_post,
    ] = it
    return {
        timestamp, volume,
        open, high,
        low, close,
        chg, percent,
        turnoverrate, amount,
        volume_post, amount_post,
    }
}

function formatDate(t) {
    return dayjs(t).format('YYYY-MM-DD')
}

async function main() {
    const { data } = await getKLine({
        symbol: 'SH601360',
        begin: Date.now(),
        period: 'day',
        type: 'before',
        count: '-250',
        indicator: 'kline'
    })
    let winCount = 0
    let loseCount = 0
    for (let i = 0; i < data.item.length - 2; i++) {
        const day0 = getItem(data.item[i])
        const day1 = getItem(data.item[i + 1])
        const day2 = getItem(data.item[i + 2])
        if (day0.close - day0.open < 0
            && day1.close - day1.open > 0
            && day1.close > day0.open
            && day1.volume > day0.volume) {
            if ((day2.high - day1.close) / day1.close >= 0.006) {
                winCount++
            } else {
                console.log(formatDate(day2.timestamp), day2.close, ((day2.high - day1.close) / day2.close * 100).toFixed(1) + '%',  ((day2.low - day1.close) / day2.close * 100).toFixed(1) + '%')
                loseCount++
            }
        }
    }
    console.log(winCount, loseCount)
}

await main()



