import { defineStore } from 'pinia'
import { getStock, getRealtimeStock, getChartMinute } from '@/apis/snowball.js'
import get from 'lodash/get.js'
import { useWatchStore } from '@/store/watch.js'
import { getFromLocalStorage, setToLocalStorage } from '@/common/loca_storage'

export const useStockStore = defineStore('stock', {
    state() {
        return {
            symbol: '',
            stockData: null,
            chartMinuteData: null,
            recentlyStockList: getFromLocalStorage('cw_recently_stock_list') ?? [],
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
        deleteRencetlyStock(symbol) {
            const findIndex = this.recentlyStockList.findIndex((it) => it.code === symbol)
            if (findIndex > -1) {
                this.recentlyStockList.splice(findIndex, 1)
                setToLocalStorage('cw_recently_stock_list', this.recentlyStockList)
            }
        },
        appentCurrentToRecentlyStockList() {
            if (this.symbol && this.recentlyStockList.every((it) => it.code !== this.symbol)) {
                this.recentlyStockList.unshift({
                    code: this.symbol,
                    name: get(this, 'stockData.quote.name', this.symbol),
                })
                setToLocalStorage('cw_recently_stock_list', this.recentlyStockList)
            }
        },
        async changeSymbol(symbol) {
            this.symbol = symbol
            if (this.symbol) {
                await this.onSearch()
                this.appentCurrentToRecentlyStockList()
                await useWatchStore().onSearch()
            } else {
                this.stockData = null
                this.chartMinuteData = null
            }
        },
        async pollRealtimeStock() {
            let loopCount = 0
            while (true) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                if (this.symbol) {
                    if (this.isStockTrading) {
                        const data = await getRealtimeStock(this.symbol)
                        const quote = data?.[0]
                        if (quote) {
                            Object.assign(this.stockData.quote, quote)
                            if (loopCount % 20 === 0) {
                                await this.fetchChartMinuteData('1d')
                            }
                        }
                    }
                    if (loopCount % 30 === 0) {
                        await this.fetchStockData()
                    }
                }
                loopCount++
            }
        },
        async onSearch() {
            await Promise.all([
                this.fetchStockData(),
                this.fetchChartMinuteData('1d'),
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