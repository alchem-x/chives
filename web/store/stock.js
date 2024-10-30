import { defineStore } from 'pinia'
import { getStock, getRealtimeStock } from '@/apis/snowball.js'
import get from 'lodash/get.js'

function normalizeSymbol(symbol) {
    return symbol.replace(/:/g, '')
}

export const useStockStore = defineStore('stock', {
    state() {
        return {
            symbol: '',
            stockData: null,
        }
    },
    getters: {
        isStockTrading() {
            return get(this, 'stockData.market.status') === '交易中'
        },
        stockName() {
            return get(this, 'stockData.quote.name')
        },
        normalizedSymbol() {
            return normalizeSymbol(this.symbol)
        },
    },
    actions: {
        async pollRealtimeStock() {
            while (true) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                if (this.normalizedSymbol && this.isStockTrading) {
                    const data = await getRealtimeStock(this.normalizedSymbol)
                    const quote = data?.[0]
                    if (quote) {
                        Object.assign(this.stockData.quote, quote)
                    }
                }
            }
        },
        async onSearch() {
            const data = await getStock(this.normalizedSymbol)
            if (data) {
                this.stockData = data
            }
        },
    },
})