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
        async fetchMarketStatus() {
            const data = await getStock(this.symbol)
            if (data && this.stockData) {
                Object.assign(this.stockData.market, data.market)
            }
        },
        async pollRealtimeStock() {
            let loopCount = 0
            while (true) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                if (this.symbol && this.isStockTrading) {
                    const data = await getRealtimeStock(this.symbol)
                    const quote = data?.[0]
                    if (quote) {
                        Object.assign(this.stockData.quote, quote)
                        if (this.chartType === '1d' && loopCount % 20 === 0) {
                            await this.fetchMarketStatus()
                            await this.fetchChartMinuteData('1d')
                        }
                    }
                }
                loopCount++
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