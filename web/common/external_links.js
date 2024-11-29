export function getSnowballLink({ symbol }) {
    return `https://xueqiu.com/S/${symbol}`
}

export function getTVLink({ code, exchange }) {
    const getTVSymbol = () => {
        switch (exchange) {
            case 'SH':
                return `SSE:${code}`
            case 'SZ':
                return `SZSE:${code}`
            default:
                return `${exchange}:${code}`
        }
    }
    const params = new URLSearchParams({ symbol: getTVSymbol() })
    return `https://cn.tradingview.com/chart/?${params}`
}