import { SNOWBALL_TOKEN } from '../common/global.js'

async function fetchSnowballAPI(url, params) {
    const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
        headers: {
            cookie: `xq_a_token=${SNOWBALL_TOKEN};u=1`,
        }
    })
    return await response.json()
}

export function getSuggestStock(q) {
    return fetchSnowballAPI('https://xueqiu.com/query/v1/suggest_stock.json', { q })
}

export function getStock(symbol, extend = 'detail') {
    return fetchSnowballAPI('https://stock.xueqiu.com/v5/stock/quote.json', {
        symbol,
        extend,
    })
}

export function getRealtimeStock(symbol) {
    return fetchSnowballAPI('https://stock.xueqiu.com/v5/stock/realtime/quotec.json', {
        symbol,
        _: new Date().getTime(),
    })
}

export function getChartMinute({ symbol, period }) {
    return fetchSnowballAPI('https://stock.xueqiu.com/v5/stock/chart/minute.json', {
        symbol,
        period,
    })
}

export function getKLine({ symbol, begin, period, type, count, indicator }) {
    return fetchSnowballAPI('https://stock.xueqiu.com/v5/stock/chart/kline.json', {
        symbol,
        begin,
        period,
        type,
        count,
        indicator,
    })
}