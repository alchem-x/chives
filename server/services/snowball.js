import { SNOWBALL_TOKEN, SNOWBALL_U } from '../common/global.js'

export async function getStock(symbol) {
    const params = new URLSearchParams({
        symbol,
        extend: 'detail',
    })
    const response = await fetch('https://stock.xueqiu.com/v5/stock/quote.json?' + params, {
        headers: {
            cookie: `xq_a_token=${SNOWBALL_TOKEN}`
        }
    })
    return await response.json()
}

export async function getRealtimeStock(symbol) {
    const params = new URLSearchParams({
        symbol,
        _: new Date().getTime(),
    })
    const response = await fetch('https://stock.xueqiu.com/v5/stock/realtime/quotec.json?' + params, {
        headers: {
            cookie: `xq_a_token=${SNOWBALL_TOKEN}`
        }
    })
    return await response.json()
}

export async function getSuggestStock(q) {
    const params = new URLSearchParams({ q, })
    const response = await fetch('https://xueqiu.com/query/v1/suggest_stock.json?' + params, {
        headers: {
            cookie: `xq_a_token=${SNOWBALL_TOKEN}`
        }
    })
    return await response.json()
}

export async function getChartMinute({ symbol, period }) {
    const params = new URLSearchParams({
        symbol,
        period,
    })
    const response = await fetch('https://stock.xueqiu.com/v5/stock/chart/minute.json?' + params, {
        headers: {
            cookie: `xq_a_token=${SNOWBALL_TOKEN}`
        }
    })
    return await response.json()
}

export async function getKLine({ symbol, begin, period, type, count, indicator }) {
    const params = new URLSearchParams({
        symbol,
        begin,
        period,
        type,
        count,
        indicator,
    })
    const response = await fetch('https://stock.xueqiu.com/v5/stock/chart/kline.json?' + params, {
        headers: {
            cookie: `xq_a_token=${SNOWBALL_TOKEN};u=${SNOWBALL_U}`,
        }
    })
    return await response.json()
}