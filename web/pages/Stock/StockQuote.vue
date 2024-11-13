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
            <NCollapse v-if="info.extraItems" arrow-placement="right">
                <NCollapseItem>
                    <template #header>
                        <span class="title-collapse">更多</span>
                    </template>
                    <div class="item-container">
                        <div class="item" v-for="(it) of info.extraItems">
                            <span class="name">{{ it.name }}:</span>
                            <span class="value" :class="it.className">{{ it.value }}</span>
                        </div>
                    </div>
                </NCollapseItem>
            </NCollapse>
        </template>
        <template v-else>
            <LoadingSegment />
        </template>
    </div>
</template>

<script setup lang="jsx">
import { computed } from 'vue'
import { NButton, NCollapse, NCollapseItem } from 'naive-ui'
import { isNil, isNumber } from 'lodash-es'
import { simplifyNumber } from '@/common/formating.js'
import { useStockStore } from '@/store/stock.js'
import { getSnowballLink } from '@/common/snowball.js'

import LoadingSegment from '@/common/LoadingSegment.vue'

const stockStore = useStockStore()

const info = computed(() => {
    const { quote, market = {}, others = {} } = stockStore.stockData
    if (quote) {
        const toFixed2 = (n) => isNumber(n) ? n.toFixed(2) : n
        const items = [
            { name: '价格', value: quote.current ? `${quote.current} (${quote.chg >= 0 ? `+${quote.chg ?? 0}` : quote.chg}, ${quote.percent >= 0 ? `+${toFixed2(quote.percent)}` : toFixed2(quote.percent)}%)` : '', className: { red: quote.chg > 0, green: quote.chg < 0 } },
            { name: '最高', value: quote.high, className: { red: quote.high > quote.last_close, green: quote.high < quote.last_close } },
            { name: '最低', value: quote.low, className: { red: quote.low > quote.last_close, green: quote.low < quote.last_close } },
            { name: '今开', value: quote.open, className: { red: quote.open > quote.last_close, green: quote.open < quote.last_close } },
            { name: '昨收', value: quote.last_close, },
            { name: '涨停', value: quote.limit_up, className: { red: quote.limit_up > quote.last_close, green: quote.limit_up < quote.last_close } },
            { name: '跌停', value: quote.limit_down, className: { red: quote.limit_down > quote.last_close, green: quote.limit_down < quote.last_close } },
            { name: '量比', value: quote.volume_ratio, className: { red: quote.volume_ratio > 1, green: quote.volume_ratio < 1 } },
            { name: '委比', value: others.pankou_ratio ? others.pankou_ratio + '%' : others.pankou_ratio, className: { red: others.pankou_ratio > 0, green: others.pankou_ratio < 0 } },
            { name: '成交量', value: quote.volume ? simplifyNumber(Math.trunc(quote.volume / 100)) + '手' : null, },
            { name: '成交额', value: simplifyNumber(quote.amount), },
            { name: '换手', value: quote.turnover_rate ? quote.turnover_rate + '%' : null, },
            { name: '振幅', value: quote.amplitude ? quote.amplitude + '%' : null, },
        ]
        const extraItems = [
            { name: '总市值', value: simplifyNumber(quote.market_capital), },
            { name: '市盈率(动)', value: quote.pe_forecast < 0 ? '亏损' : toFixed2(quote.pe_forecast), },
            { name: '市盈率(静)', value: quote.pe_lyr < 0 ? '亏损' : toFixed2(quote.pe_lyr), },
            { name: '市盈率(TTM)', value: quote.pe_ttm < 0 ? '亏损' : toFixed2(quote.pe_ttm), },
            { name: '52周最高', value: toFixed2(quote.low52w) },
            { name: '52周最低', value: toFixed2(quote.high52w) },
            { name: '货币单位', value: quote.currency, },
            { name: '交易所', value: quote.exchange, },
            { name: '状态', value: market.status, },
        ]
        const Stock = () => (
            <a href={getSnowballLink(quote.symbol)} target="_blank">
                <NButton quaternary type="info">
                    <span class="stock-name">
                        {quote.name}({quote.symbol})
                    </span>
                </NButton>
            </a>
        )
        return {
            Stock,
            items: items.filter((it) => !isNil(it.value)),
            extraItems: extraItems.filter((it) => !isNil(it.value)),
        }
    } else {
        return {
            items: [
                { name: '异常', value: '数据为空', className: 'red' }
            ],
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
    min-height: 150px;
    container-type: inline-size;

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

    @container (max-width: 680px) {
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

.title-collapse {
    font-size: 16px;
    user-select: none;
}
</style>
