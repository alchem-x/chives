import { defineStore } from 'pinia'
import { getStock, getRealtimeStock, getChartMinute } from '@/apis/snowball.js'
import get from 'lodash/get.js'

export const useStockStore = defineStore('stock', {
    state() {
        return {
            symbol: '',
            stockData: null,
            chartType: '1d',
            chartMinuteData: null,
        }
    },
    getters: {
        isStockTrading() {
            return get(this, 'stockData.market.status') === '交易中'
        },
        stockName() {
            return get(this, 'stockData.quote.name')
        },
    },
    actions: {
        async pollRealtimeStock() {
            while (true) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                if (this.symbol && this.isStockTrading) {
                    const data = await getRealtimeStock(this.symbol)
                    const quote = data?.[0]
                    if (quote) {
                        Object.assign(this.stockData.quote, quote)
                        if (this.chartType === '1d') {
                            await this.fetchChartMinuteData('1d')
                        }
                    }
                }
            }
        },
        async onSearch() {
            await Promise.all([
                this.fetchStockData(),
                this.fetchChartMinuteData(this.chartType),
            ])
        },
        async fetchStockData() {
            const data = await getStock(this.symbol)
            if (data) {
                this.stockData = data
            }
        },
        async fetchChartMinuteData(period) {
            this.chartMinuteData = null
            const data = await getChartMinute({
                symbol: this.symbol,
                period,
            })
            if (data) {
                this.chartMinuteData = data
            }
        }
    },
})