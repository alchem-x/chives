<template>
    <div class="stock-quote-container">
        <template v-if="stockStore.stockData">
            <div v-if="info.Stock">
                <component :is="info.Stock" />
            </div>
            <div class="item-container">
                <div class="item" v-for="(it) of info.items">
                    <span class="name">{{ it.name }}:</span>
                    <span class="value" :class="it.className">{{ it.value }}</span>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="loading-segment">
                <img :src="'/images/loading-coin.svg'" alt="">
            </div>
        </template>
    </div>
</template>

<script setup lang="jsx">
import { NButton } from 'naive-ui'
import { computed } from 'vue'
import { simplifyNumber } from '@/common/formating.js'
import { useStockStore } from '@/store/stock.js'
import isNil from 'lodash/isNil.js'

const stockStore = useStockStore()

const info = computed(() => {
    const { quote, market = {} } = stockStore.stockData
    if (quote) {
        const items = [
            { name: '价格', value: quote.current ? `${quote.current} (${quote.chg >= 0 ? `+${quote.chg ?? 0}` : quote.chg}, ${quote.percent >= 0 ? `+${quote.percent ?? 0}` : quote.percent}%)` : '', className: { red: quote.chg > 0, green: quote.chg < 0 } },
            { name: '最高', value: quote.high, className: { red: quote.high > quote.last_close, green: quote.high < quote.last_close } },
            { name: '最低', value: quote.low, className: { red: quote.low > quote.last_close, green: quote.low < quote.last_close } },
            { name: '今开', value: quote.open, className: { red: quote.open > quote.last_close, green: quote.open < quote.last_close } },
            { name: '昨收', value: quote.last_close, },
            { name: '涨停', value: quote.limit_up, className: { red: quote.limit_up > quote.last_close, green: quote.limit_up < quote.last_close } },
            { name: '跌停', value: quote.limit_down, className: { red: quote.limit_down > quote.last_close, green: quote.limit_down < quote.last_close } },
            { name: '成交量', value: quote.volume ? simplifyNumber(Math.trunc(quote.volume / 100)) + '手' : '', },
            { name: '成交额', value: simplifyNumber(quote.amount), },
            { name: '换手', value: quote.turnover_rate ? quote.turnover_rate + '%' : '', },
            { name: '振幅', value: quote.amplitude ? quote.amplitude + '%' : '', },
            { name: '货币单位', value: quote.currency, },
            { name: '交易所', value: quote.exchange, },
            { name: '状态', value: market.status, },
        ]
        const Stock = () => (
            <a href={`https://xueqiu.com/S/${quote.symbol}`} target="_blank">
                <NButton quaternary type="info" size="large">
                    <span class="stock-name">
                        {quote.name}({quote.symbol})
                    </span>
                </NButton>
            </a>
        )
        return {
            Stock,
            items: items.filter((it) => !isNil(it.value))
        }
    } else {
        return {
            items: [
                { name: '异常', value: '数据为空', className: 'red' }
            ]
        }
    }
})

</script>

<style scoped lang="less">
.stock-quote-container {
    box-sizing: border-box;
    border: 1px solid #efeff5;
    border-radius: 3px;
    padding: 12px;
    position: relative;
    min-height: 200px;
    container-type: inline-size;

    .loading-segment {
        height: 100%;
        display: grid;
        position: absolute;
        inset: 0;
        place-items: center;

        img {
            user-select: none;
        }
    }

    :deep(.stock-name) {
        font-size: 16px;
        color: #111;
    }

    .item-container {
        column-count: 3;

        .item {
            display: flex;
            gap: .25rem;

            :deep(.name) {
                font-size: 16px;
                color: #111;

                >* {
                    font-size: 16px;
                }
            }

            :deep(.value) {
                font-size: 16px;

                &.red {
                    color: #ee2500;
                    font-weight: 500;
                }

                &.green {
                    color: #093;
                    font-weight: 500;
                }

                font-weight: 400;
            }
        }
    }

    @container (max-width: 780px) {
        .item-container {
            column-count: 2;
        }
    }

    @container (max-width: 500px) {
        .item-container {
            column-count: 1;
        }
    }
}
</style>
