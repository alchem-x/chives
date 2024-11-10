export async function getStock(symbol) {
    const params = new URLSearchParams({ symbol, })
    const response = await fetch('/api/snowball/stock?' + params)
    const r = await response.json()
    return r?.data
}

export async function getRealtimeStock(symbol) {
    const params = new URLSearchParams({ symbol, })
    const response = await fetch('/api/snowball/realtime-stock?' + params)
    const r = await response.json()
    return r?.data
}

export async function getSuggestStock(q) {
    if (q) {
        const params = new URLSearchParams({ q, })
        const response = await fetch('/api/snowball/suggest-stock?' + params)
        const r = await response.json()
        return r?.data
    } else {
        return []
    }
}

export async function getChartMinute({ symbol, period }) {
    const params = new URLSearchParams({ symbol, period })
    const response = await fetch('/api/snowball/chart/minute?' + params)
    const r = await response.json()
    return r?.data
}

export async function getChartKLine({  symbol, begin, period, type, count, indicator, }) {
    const params = new URLSearchParams({  symbol, begin, period, type, count, indicator, })
    const response = await fetch('/api/snowball/chart/kline?' + params)
    const r = await response.json()
    return r?.data
}