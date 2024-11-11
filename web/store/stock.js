import { Cron } from 'croner'
import { shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { get } from 'lodash-es'
import { useWatchStore } from '@/store/watch.js'
import { getStock, getRealtimeStock, getChartMinute, getChartKLine } from '@/apis/snowball.js'
import { getFromLocalStorage, setToLocalStorage } from '@/common/web_storage.js'

export const useStockStore = defineStore('stock', {
    state() {
        return {
            symbol: '',
            stockData: null,
            chartMinuteData: null,
            kLineData: null,
            recentlyStockList: getFromLocalStorage('cw_recently_stock_list') ?? [],
            cronJobs: shallowRef([]),
        }
    },
    getters: {
        stockCurrentPrice() {
            return get(this, 'stockData.quote.current') 
        },
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
                this.kLineData = null
            }
        },
        startCronJobs() {
            this.cronJobs.push(
                ...[
                    new Cron('*/2 * * * * *', { name: 'RealtimeStockJob' }, async () => {
                        if (this.symbol && this.isStockTrading) {
                            await this.fetchRealtimeStock()
                        }
                    }),
                    new Cron('*/30 * * * * *', { name: 'StockDataJob' }, async () => {
                        if (this.symbol) {
                            await this.fetchStockData()
                        }
                    }),
                ]
            )
        },
        startCartDataJob() {
            this.cronJobs.push(
                new Cron('*/20 * * * * *', { name: 'ChartDataJob' }, async () => {
                    if (this.symbol && this.isStockTrading) {
                        await this.fetchChartMinuteData('1d')
                    }
                }),
            )
        },
        stopCharDataJob() {
            const findIndex = this.cronJobs.findIndex((it) => it.name === 'ChartDataJob')
            if (findIndex > -1) {
                this.cronJobs[findIndex].stop()
                this.cronJobs.splice(findIndex, 1)
            }
        },
        stopCronJobs() {
            for (const job of this.cronJobs) {
                job.stop()
            }
            this.cronJobs.length = 0
        },
        async fetchRealtimeStock() {
            const data = await getRealtimeStock(this.symbol)
            const quote = data?.[0]
            if (quote) {
                Object.assign(this.stockData.quote, quote)
            }
        },
        async onSearch() {
            await Promise.all([
                this.fetchStockData(),
                this.fetchChartMinuteData('1d'),
                this.fetchKLineData(),
            ])
        },
        async fetchStockData() {
            const data = await getStock(this.symbol)
            if (data) {
                this.stockData = data
            }
        },
        async fetchChartMinuteData(period) {
            const data = await getChartMinute({
                symbol: this.symbol,
                period,
            })
            if (data) {
                this.chartMinuteData = data
            }
        },
        async fetchKLineData() {
            const data = await getChartKLine({
                symbol: this.symbol,
                begin: Date.now(),
                period: 'day',
                type: 'before',
                count: '-250',
                indicator: 'kline'
            })
            if (data) {
                this.kLineData = data
            }
        }
    },
})